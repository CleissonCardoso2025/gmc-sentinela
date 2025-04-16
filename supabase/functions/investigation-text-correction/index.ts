
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    // Extract text from request
    const { text } = await req.json();
    
    if (!text) {
      throw new Error('No text provided');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em português e em relatórios policiais. Sua tarefa é corrigir erros gramaticais, melhorar a clareza e a formalidade dos textos, mantendo o significado original. Não adicione informações que não estejam presentes no texto original.' 
          },
          { 
            role: 'user', 
            content: `Corrija o seguinte texto e melhore a clareza, mantendo o significado: ${text}` 
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    const correctedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ correctedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in investigation-text-correction function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
