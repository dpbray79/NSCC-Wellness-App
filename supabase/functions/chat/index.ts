import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
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

        // Official Resources Knowledge Base (RAG Context)
        const WELLNESS_RESOURCES = `
OFFICIAL NSCC RESOURCES & CONTACTS:
1. NSCC Student Wellness Hub (Central Portal): https://nscc.sharepoint.com/sites/Student_Wellness_Hub
2. Urgent Crisis Support (24/7): 
   - Suicide Crisis Helpline: Call 988
   - NS Mental Health Crisis Line: 1-888-429-8167
   - Good2Talk Nova Scotia: https://good2talk.ca/novascotia/
3. NSCC Advising & Counselling: Book confidential appointments via the Support tab in the app or the Wellness Hub.
4. Food Security: Access campus food banks and community nutrition supports (Feed Nova Scotia).
5. Peer Support: NSCC Student Association (SA), 2SLGBTQIA+ Groups, and Indigenous Student Supports.
`;

        // System instructions
        const systemInstruction = `You are a supportive, empathetic Wellness Chat for Nova Scotia Community College (NSCC) students.
Your goal is to provide a safe, non-judgmental space for students to reflect on their day and offer helpful local resources.

${WELLNESS_RESOURCES}

The student's current wellness check-in data (out of 10) for TODAY is:
- Sleep Quality: ${wellnessData?.sleep || 'Not recorded today'}
- Stress Level: ${wellnessData?.stress || 'Not recorded today'} (Note: Higher means more stressed)
- Cognitive Energy: ${wellnessData?.cognitive || 'Not recorded today'}
- Social Belonging: ${wellnessData?.social || 'Not recorded today'}
- Food Security: ${wellnessData?.food_security || 'Not recorded today'}

Use this context to be empathetic. 
When relevant to the conversation OR if the student asks for help, suggest one of the OFFICIAL NSCC RESOURCES listed above. Always provide the full link or phone number.

If the student expresses thoughts of self-harm, severe distress, or crisis, you MUST suggest they call 988 or the NS Mental Health Crisis Line (1-888-429-8167) and include the exact string "CRISIS_ESCALATE" in your response.`;

        const geminiHistory = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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
