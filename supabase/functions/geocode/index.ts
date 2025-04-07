
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS request for CORS
Deno.serve(async (req) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    // Extract the request data
    const requestData = await req.json();
    
    // Get API key from environment variable
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    // If the request is just asking for the API key, return it
    if (requestData.getApiKey) {
      return new Response(
        JSON.stringify({ 
          apiKey: apiKey
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const { address, reverse = false } = requestData;
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address or coordinates are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    if (!apiKey) {
      console.error('Google Maps API key not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'API configuration error',
          // Return coordinates in a formatted way that the frontend can still use
          results: [{ 
            formatted_address: reverse ? `Coordenadas: ${address}` : address,
            geometry: {
              location: reverse ? {
                lat: parseFloat(address.split(',')[0]),
                lng: parseFloat(address.split(',')[1])
              } : null
            }
          }]
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    let url: string;
    
    if (reverse) {
      // For reverse geocoding (coordinates to address)
      // Expects address in format "lat,lng"
      url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(address)}&key=${apiKey}`
    } else {
      // For forward geocoding (address to coordinates)
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    }
    
    console.log(`Making geocoding request: ${reverse ? 'reverse' : 'forward'}`);
    
    // Fetch from Google Maps Geocoding API
    const response = await fetch(url)
    const data = await response.json()
    
    console.log(`Geocoding response status: ${data.status}`);
    
    // If the API call fails, still return a usable response with the coordinates
    if (data.status !== 'OK') {
      console.error(`Geocoding API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      
      // Return a formatted response that the frontend can still use
      return new Response(
        JSON.stringify({ 
          error: data.error_message || 'Geocoding failed',
          results: [{ 
            formatted_address: reverse ? `Coordenadas: ${address}` : address,
            geometry: {
              location: reverse ? {
                lat: parseFloat(address.split(',')[0]),
                lng: parseFloat(address.split(',')[1])
              } : null
            }
          }]
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Return geocoding results
    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in geocode function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
