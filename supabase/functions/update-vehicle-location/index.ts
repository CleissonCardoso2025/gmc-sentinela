
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS request for CORS
Deno.serve(async (req) => {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get request data
    const { vehicleId, latitude, longitude, accuracy, locationName } = await req.json()
    
    // Validate required fields
    if (!vehicleId || !latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'vehicleId, latitude, and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get Supabase URL and key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://rdkugzjrvlvcorfsbdaz.supabase.co'
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extract JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '')
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Error getting user from token:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Insert location data into the database
    const { data, error } = await supabase
      .from('vehicle_locations')
      .insert({
        vehicle_id: vehicleId,
        latitude,
        longitude,
        accuracy: accuracy || null,
        location_name: locationName || null,
        user_id: user.id,
        recorded_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error inserting location data:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Location updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in update-vehicle-location function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
