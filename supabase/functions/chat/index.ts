import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { messages, wellnessData } = await req.json()

        const apiKey = Deno.env.get('GEMINI_API_KEY')
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set')
        }

        // System instructions (Gemini handles system prompts separately from the chat history)
        const systemInstruction = `You are a supportive, empathetic Wellness Companion for Nova Scotia Community College (NSCC) students.
Your goal is to provide a safe, non-judgmental space for students to reflect on their day.
You MUST NOT diagnose, prescribe, or provide medical advice.

The student's current wellness check-in data (out of 10) is:
- Sleep Quality: ${wellnessData?.sleep || 'Unknown'}
- Perceived Stress: ${wellnessData?.stress || 'Unknown'} (Higher is more stressed)
- Cognitive Energy: ${wellnessData?.cognitive || 'Unknown'}
- Social Belonging: ${wellnessData?.social || 'Unknown'}
- Food Security: ${wellnessData?.food_security || 'Unknown'}

Use this context to be empathetic, but don't explicitly list their scores back to them unless relevant.
If the student expresses thoughts of self-harm, severe distress, or crisis, you MUST include the exact string "CRISIS_ESCALATE" in your response so the client app can trigger emergency UI.`;

        // Map the existing chat history format into Gemini's expected format
        // Gemini expects: { role: 'user' | 'model', parts: [{ text: '...' }] }
        const geminiHistory = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Call Google Gemini API
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: { text: systemInstruction }
                },
                contents: geminiHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                }
            }),
        })

        const data = await geminiResponse.json()

        if (!geminiResponse.ok) {
            console.error("Gemini API Error:", data);
            throw new Error(data.error?.message || 'Failed to fetch from Gemini');
        }

        const replyContent = data.candidates[0].content.parts[0].text;

        return new Response(JSON.stringify({ reply: replyContent }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        console.error('Error processing chat:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
