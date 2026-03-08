import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Daily fact mode
    if (type === "daily-fact") {
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

    // Chat mode - streaming
    const systemPrompt = `You are "Matdaan Assistant", an AI helper for Indian voters. You help with:
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
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
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("voting-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
