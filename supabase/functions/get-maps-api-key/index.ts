
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
export async function corsHandler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }
  return null
}

export const handler = async (req: Request) => {
  // Handle CORS
  const corsResponse = await corsHandler(req)
  if (corsResponse) return corsResponse

  // Get API_KEY from env
  const API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')

  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Google Maps API key not configured' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Return the API key
  return new Response(
    JSON.stringify({ 
      apiKey: API_KEY 
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

// To make this script compatible with both Deno Deploy and Supabase Edge Functions
Deno.serve(handler)
