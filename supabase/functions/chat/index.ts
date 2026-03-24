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
            console.error("CRITICAL: GEMINI_API_KEY is not set in secrets.")
            throw new Error('GEMINI_API_KEY is not set')
        }

        console.log("Processing request with messages:", messages.length);

        // System instructions
        const systemInstruction = `You are a supportive, empathetic Wellness Companion for Nova Scotia Community College (NSCC) students.
Your goal is to provide a safe, non-judgmental space for students to reflect on their day.
You MUST NOT diagnose, prescribe, or provide medical advice.

The student's current wellness check-in data (out of 10) is:
- Sleep Quality: ${wellnessData?.sleep || 'Unknown'}
- Perceived Stress: ${wellnessData?.stress || 'Unknown'} (Higher is more stressed)
- Cognitive Energy: ${wellnessData?.cognitive || 'Unknown'}
- Social Belonging: ${wellnessData?.social || 'Unknown'}
- Food Security: ${wellnessData?.food_security || 'Unknown'}

Use this context to be empathetic. 
If the student expresses thoughts of self-harm, severe distress, or crisis, you MUST include the exact string "CRISIS_ESCALATE" in your response.`;

        const geminiHistory = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: { text: systemInstruction } },
                contents: geminiHistory,
                generationConfig: { temperature: 0.7, maxOutputTokens: 350 }
            }),
        })

        const data = await geminiResponse.json()

        if (!geminiResponse.ok) {
            console.error(`Google Gemini API Error (${geminiResponse.status}):`, JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || `Gemini API Error: ${geminiResponse.status}`);
        }

        const replyContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm listening. Tell me more.";
        console.log("Gemini responded successfully. Length:", replyContent.length);

        return new Response(JSON.stringify({ reply: replyContent }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        console.error('Edge Function Crash Log:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Return 200 so the frontend gets the JSON error instead of a generic network fail
        })
    }
})
