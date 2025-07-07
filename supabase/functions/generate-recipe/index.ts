
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeRequest {
  query: string;
  language: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language }: RecipeRequest = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Create language-specific prompt
    let languageInstruction = '';
    let sampleResponse = '';
    
    if (language === 'telugu') {
      languageInstruction = 'Generate the complete recipe in Telugu language. All text including recipe name, ingredients, instructions, and other details should be in Telugu.';
      sampleResponse = 'Example format: {"name": "స్పైసీ చికెన్ కర్రీ", "ingredients": ["500గ్రా చికెన్ ముక్కలు", "2 పెద్ద ఉల్లిపాయలు"], "instructions": ["నూనెను వేడిచేయండి", "ఉల్లిపాయలను వేయండి"], "prepTime": "15 నిమిషాలు", "cookTime": "25 నిమిషాలు", "servings": "4 మంది", "difficulty": "మధ్యమం"}';
    } else if (language === 'hindi') {
      languageInstruction = 'Generate the complete recipe in Hindi language. All text including recipe name, ingredients, instructions, and other details should be in Hindi.';
      sampleResponse = 'Example format: {"name": "स्पाइसी चिकन करी", "ingredients": ["500ग्राम चिकन के टुकड़े", "2 बड़े प्याज"], "instructions": ["तेल गर्म करें", "प्याज डालें"], "prepTime": "15 मिनट", "cookTime": "25 मिनट", "servings": "4 लोग", "difficulty": "मध्यम"}';
    } else {
      languageInstruction = 'Generate the complete recipe in English language.';
      sampleResponse = 'Example format: {"name": "Spicy Chicken Curry", "ingredients": ["500g chicken pieces", "2 large onions"], "instructions": ["Heat oil in pan", "Add onions"], "prepTime": "15 minutes", "cookTime": "25 minutes", "servings": "4 people", "difficulty": "Medium"}';
    }

    const prompt = `You are a professional chef assistant. Based on the user's input "${query}", generate a complete, detailed recipe.

${languageInstruction}

Requirements:
1. Create a realistic, cookable recipe with proper measurements and cooking techniques
2. Include detailed step-by-step instructions
3. Provide accurate prep time, cook time, servings, and difficulty level
4. All text must be in the specified language
5. Return ONLY valid JSON format without any markdown or additional text

${sampleResponse}

User query: ${query}
Language: ${language}

Generate the recipe now:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini Response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Clean and parse the JSON response
    let cleanedResponse = generatedText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/```\n?$/, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/```\n?$/, '');
    }

    let recipe;
    try {
      recipe = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', cleanedResponse);
      throw new Error('Failed to parse recipe JSON from Gemini response');
    }

    // Validate required fields
    if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
      throw new Error('Invalid recipe format from Gemini');
    }

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate recipe using Gemini AI'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
