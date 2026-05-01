import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Matdaan Assistant", an AI helper for Indian voters. You help with:
- Voter registration (Form 6, 6A, 7, 8, 8A)
- Finding polling booths
- Explaining voter rights under the Indian Constitution
- Election Commission of India procedures
- EVM and VVPAT information
- Election timeline and phases
- Document requirements for voting (Voter ID, Aadhaar, etc.)

Rules:
- Be helpful, friendly, and concise
- Answer in the same language the user asks in (Hindi, English, etc.)
- If unsure, direct to the official ECI website (eci.gov.in) or Voter Helpline 1950
- Stay strictly on topic about Indian elections and voting
- Do NOT discuss political parties' ideologies or who to vote for
- Keep answers short (2-4 sentences) unless asked for detail`;

async function callLovableAI(messages: any[]) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  });
}

/**
 * Direct Google Gemini API fallback.
 * Uses the OpenAI-compatible endpoint so we can keep the same SSE
 * (`data: {choices:[{delta:{content}}]}`) format as Lovable AI.
 * Docs: https://ai.google.dev/gemini-api/docs/openai
 */
async function callGeminiDirect(messages: any[]) {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
  return await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const body = await req.json();
    const { messages, type } = body;
    // Provider override for testing: "gemini" forces direct Gemini API
    const provider = url.searchParams.get("provider") || body.provider || null;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Daily fact mode (always Lovable AI)
    if (type === "daily-fact") {
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: "You return a single interesting fact about Indian democracy, elections, or the Indian Constitution. Return ONLY a JSON object with 'fact' (the fact in English, 1-2 sentences) and 'emoji' (a single relevant emoji). No markdown." },
            { role: "user", content: `Give me a unique democracy fact for date: ${today}. Make it surprising and educational.` },
          ],
          temperature: 0.9,
        }),
      });
      const data = await response.json();
      let content = data.choices[0].message.content.trim();
      content = content.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
      return new Response(content, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chat mode with fallback strategy
    console.log(`[voting-assistant] provider param: ${provider}, msg count: ${messages?.length}`);
    let response: Response;
    let usedProvider = "lovable";

    if (provider === "gemini") {
      // Force direct Gemini for testing
      response = await callGeminiDirect(messages);
      usedProvider = "gemini-direct";
    } else {
      // Default: try Lovable AI first
      response = await callLovableAI(messages);

      // Fallback to direct Gemini on 429 (rate limit) or 402 (credits exhausted)
      if ((response.status === 429 || response.status === 402) && Deno.env.get("GEMINI_API_KEY")) {
        console.log(`Lovable AI returned ${response.status}, falling back to Gemini direct`);
        try { await response.body?.cancel(); } catch {}
        response = await callGeminiDirect(messages);
        usedProvider = "gemini-fallback";
      }
    }

    if (!response.ok) {
      const t = await response.text();
      console.error(`${usedProvider} error:`, response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-AI-Provider": usedProvider,
      },
    });
  } catch (e) {
    console.error("voting-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
