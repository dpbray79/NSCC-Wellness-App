import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { wellnessData } = await req.json()

        const apiKey = Deno.env.get('GEMINI_API_KEY')
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set')
        }

        const systemInstruction = `You are a supportive Wellness Assistant for NSCC students.
Your task is to provide a single, short (max 2 sentences) empathetic insight based on the student's latest wellness scores.
Focus on the lowest score or the most concerning trend.
Then, recommend one specific resource type (e.g., 'Counselling', 'Peer Support', 'Food Bank').
Keep it extremely conversational and warm.`;

        const prompt = `Student Wellness Scores (out of 10):
- Sleep: ${wellnessData?.sleep || 'Unknown'}
- Stress: ${wellnessData?.stress || 'Unknown'} (Higher is more stressed)
- Cognitive Energy: ${wellnessData?.cognitive || 'Unknown'}
- Social Belonging: ${wellnessData?.social || 'Unknown'}
- Food Security: ${wellnessData?.food_security || 'Unknown'}

Provide a quick insight and a recommendation.`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: { text: systemInstruction } },
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
            }),
        })

        const data = await geminiResponse.json()
        const insight = data.candidates?.[0]?.content?.parts?.[0]?.text || "Your well-being matters. Consider checking out our support resources today.";

        return new Response(JSON.stringify({ insight }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }
})
