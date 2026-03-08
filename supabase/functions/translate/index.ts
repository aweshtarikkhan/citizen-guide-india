import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for cache lookup
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLang } = await req.json();

    if (!texts || !Array.isArray(texts) || !targetLang) {
      return new Response(JSON.stringify({ error: "Missing texts array or targetLang" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If target is English, return as-is
    if (targetLang === "en") {
      return new Response(JSON.stringify({ translations: texts }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check cache for all texts
    const hashes = texts.map((t: string) => simpleHash(t));
    const { data: cached } = await supabase
      .from("translation_cache")
      .select("source_text_hash, translated_text")
      .eq("target_lang", targetLang)
      .in("source_text_hash", hashes);

    const cacheMap = new Map<string, string>();
    (cached || []).forEach((c: any) => cacheMap.set(c.source_text_hash, c.translated_text));

    // Find uncached texts
    const uncachedIndices: number[] = [];
    const uncachedTexts: string[] = [];
    texts.forEach((t: string, i: number) => {
      if (!cacheMap.has(hashes[i])) {
        uncachedIndices.push(i);
        uncachedTexts.push(t);
      }
    });

    const langNames: Record<string, string> = {
      hi: "Hindi", bn: "Bengali", ta: "Tamil", te: "Telugu",
      kn: "Kannada", ml: "Malayalam", mr: "Marathi", gu: "Gujarati",
      pa: "Punjabi", or: "Odia", as: "Assamese", ur: "Urdu",
      sa: "Sanskrit", kok: "Konkani", mai: "Maithili", doi: "Dogri",
      sd: "Sindhi", ne: "Nepali", mni: "Manipuri", sat: "Santali",
      ks: "Kashmiri", bho: "Bhojpuri",
    };

    // Translate uncached texts via AI
    if (uncachedTexts.length > 0) {
      const langName = langNames[targetLang] || targetLang;

      const prompt = `You are a professional ${langName} translator. Translate the following English texts to natural, fluent ${langName}.

IMPORTANT RULES:
- Do NOT transliterate English words into ${langName} script. Instead, find the proper ${langName} equivalent.
- For example: "Explore" should become "जानें" or "खोजें" in Hindi, NOT "एक्सप्लोर"
- "Download" should become "डाउनलोड" only if no native word exists, otherwise use the native word
- Brand names and proper nouns can stay as-is
- The translation should sound like a native ${langName} speaker wrote it
- Keep the meaning and intent, not just word-for-word translation

Return ONLY a JSON array of translated strings in the same order. No explanations, no markdown.

Input texts:
${JSON.stringify(uncachedTexts)}`;

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a translation API. Return ONLY a JSON array of translated strings." },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
        }),
      });

      const aiData = await aiRes.json();
      let translatedTexts: string[] = [];

      try {
        let content = aiData.choices[0].message.content.trim();
        // Remove markdown code fences if present
        content = content.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
        translatedTexts = JSON.parse(content);
      } catch {
        // Fallback: return originals for uncached
        translatedTexts = uncachedTexts;
      }

      // Cache new translations
      const cacheInserts = translatedTexts.map((t: string, i: number) => ({
        source_text_hash: hashes[uncachedIndices[i]],
        target_lang: targetLang,
        translated_text: t,
      }));

      if (cacheInserts.length > 0) {
        await supabase.from("translation_cache").upsert(cacheInserts, {
          onConflict: "source_text_hash,target_lang",
        });
      }

      // Merge into cache map
      translatedTexts.forEach((t: string, i: number) => {
        cacheMap.set(hashes[uncachedIndices[i]], t);
      });
    }

    // Build final result in order
    const translations = texts.map((_: string, i: number) => cacheMap.get(hashes[i]) || texts[i]);

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
