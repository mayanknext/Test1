import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const stripHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return json({ error: "AI service not configured" }, 500);
    }

    const { content, url } = await req.json();

    let sourceText: string = typeof content === "string" ? content : "";
    let sourceLabel = "pasted text or uploaded file";

    if (!sourceText && typeof url === "string" && url.trim()) {
      let target: URL;
      try {
        target = new URL(url.trim());
      } catch {
        return json({ error: "That link doesn't look valid." }, 400);
      }
      if (!["http:", "https:"].includes(target.protocol)) {
        return json({ error: "Only http and https links are supported." }, 400);
      }

      const page = await fetch(target.toString(), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; StoryFlowAI/1.0)" },
      });
      if (!page.ok) {
        return json({ error: `Couldn't read that link (status ${page.status}).` }, 400);
      }
      const raw = await page.text();
      sourceText = stripHtml(raw);
      sourceLabel = `web page: ${target.hostname}`;
    }

    if (!sourceText || sourceText.length < 40) {
      return json({ error: "Not enough readable content to analyse." }, 400);
    }

    const excerpt = sourceText.slice(0, 24000);

    const systemPrompt = `You are a story strategist for content creators. You analyse raw material (articles, research, notes, blog pages, CSV datasets) and find the patterns, trends and emotional threads inside it.

Return STRICT JSON only, matching this shape:
{
  "summary": "2-3 sentence plain-language summary of what this content is about",
  "contentType": "article | research | notes | dataset | web page",
  "patterns": ["3-6 concrete patterns, trends, outliers or tensions found in the content"],
  "themes": ["2-5 core themes"],
  "emotion": "the dominant emotional undercurrent, one short phrase",
  "angles": [
    {
      "title": "short name of the story angle",
      "description": "2 sentences on what this story would say and why it works",
      "style": "one of: inspirational, romantic, mystery, educational, scifi, documentary, comedy, historical",
      "audience": "one of: youtube, podcast, blog, book",
      "tone": "one of: professional, playful, storyteller, philosophical",
      "recommended": true or false,
      "reason": "one sentence on why this fits (or doesn't fit) the material best"
    }
  ]
}

Rules: give exactly 4 angles, and mark exactly ONE as recommended: true. Base every pattern and angle on real details in the content, never invented facts. For datasets, cite actual columns, trends or standout values.`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Source (${sourceLabel}). Analyse it and propose story angles.\n\n${excerpt}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("OpenAI error:", aiResponse.status, errorText);
      if (aiResponse.status === 401) {
        return json({ error: "The AI key was rejected. Please check it and try again." }, 401);
      }
      if (aiResponse.status === 429) {
        return json({ error: "AI rate limit or quota reached. Try again shortly." }, 429);
      }
      return json({ error: "AI service error. Please try again." }, 502);
    }

    const data = await aiResponse.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return json({ error: "Analysis failed. Please try again." }, 502);

    let analysis: Record<string, unknown>;
    try {
      analysis = JSON.parse(raw);
    } catch {
      return json({ error: "Analysis came back in an unexpected format." }, 502);
    }

    return json({ analysis, extractedText: excerpt });
  } catch (error) {
    console.error("analyze-content error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
