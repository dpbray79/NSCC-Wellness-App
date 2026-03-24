import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const campusData: Record<string, any> = {
    "ivany": {
        name: "Ivany Campus (Dartmouth)",
        counselling: "Office: 2nd Floor, Room 2105",
        food_bank: "Campus Cupboard: Room 1024 (Near Cafeteria)",
        peer_support: "NSCC Student Association @ Ivany Lounge"
    },
    "akerley": {
        name: "Akerley Campus (Dartmouth)",
        counselling: "Office: Main Wing, Room A124",
        food_bank: "Campus Cupboard: Room B102",
        peer_support: "Main Lobby - SA Info Desk"
    },
    "kingstec": {
        name: "Kingstec Campus (Kentville)",
        counselling: "Office: Room 128",
        food_bank: "Campus Cupboard: Room 114",
        peer_support: "Student Union Office"
    },
    "default": {
        name: "NSCC General Resources",
        counselling: "Contact Student Services at your campus.",
        food_bank: "Check your local campus directory.",
        peer_support: "Visit the NSCC Student Association website."
    }
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { campusId } = await req.json()
        const resources = campusData[campusId] || campusData["default"];

        return new Response(JSON.stringify(resources), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }
})
