import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, style, tone, length } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!content || !style || !tone || !length) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map style to storytelling approach
    const stylePrompts = {
      inspirational: "Create an uplifting and motivational narrative that inspires action and personal growth.",
      romantic: "Craft an emotionally rich story that touches the heart and explores human connection.",
      mystery: "Build a suspenseful and intriguing narrative with twists and engaging tension.",
      educational: "Present the information in a clear, engaging explainer format that teaches while it tells.",
      scifi: "Transform this into a futuristic science fiction narrative with imaginative elements.",
      documentary: "Write it as a cinematic documentary narration with vivid scene-setting and authoritative insight.",
      comedy: "Write it with warm humour, witty observations and light-hearted comic timing while keeping the substance.",
      historical: "Tell it as a sweeping historical epic, grounding events in time, place and human consequence.",
    };

    // Map tone to voice style
    const tonePrompts = {
      professional: "Use a polished, authoritative voice suitable for business contexts.",
      playful: "Employ a fun, energetic tone with creative wordplay and lighthearted moments.",
      storyteller: "Use a warm, narrative voice as if telling a story around a campfire.",
      philosophical: "Take a reflective, thought-provoking approach that explores deeper meanings.",
    };

    // Map length to word count
    const lengthGuides = {
      short: "Keep it concise at 200-300 words, perfect for a 1-2 minute read.",
      medium: "Aim for 500-700 words, suitable for a 5-minute engagement.",
      long: "Create a longer piece of 1000-1500 words with chapter-like depth.",
    };

    const systemPrompt = `You are an expert storyteller and content creator specializing in transforming raw data, documents, and information into compelling narratives.

Your task is to:
1. Understand the core message, theme, and key points from the provided content
2. ${stylePrompts[style as keyof typeof stylePrompts]}
3. ${tonePrompts[tone as keyof typeof tonePrompts]}
4. ${lengthGuides[length as keyof typeof lengthGuides]}

Important guidelines:
- Find the human story within the data or text
- Create emotional hooks and memorable moments
- Use vivid imagery and sensory details
- Build a clear narrative arc (beginning, middle, end)
- Include dialogue or quotes when it enhances the story
- Make abstract concepts tangible and relatable
- End with a powerful conclusion that resonates

The output should be ready to use for content creators - engaging, polished, and perfectly formatted.`;

    const userPrompt = `Transform the following content into an engaging story:

${content}

Remember: ${stylePrompts[style as keyof typeof stylePrompts]} ${tonePrompts[tone as keyof typeof tonePrompts]}`;

    console.log("Calling Lovable AI for story generation...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedStory = data.choices?.[0]?.message?.content;

    if (!generatedStory) {
      console.error("No story generated from AI response");
      return new Response(
        JSON.stringify({ error: "Failed to generate story" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Story generated successfully");

    return new Response(
      JSON.stringify({ story: generatedStory }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-story function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
