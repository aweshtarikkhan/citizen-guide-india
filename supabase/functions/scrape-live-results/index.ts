// ECI Live Results Scraper
// Auto-runs every 2 min via pg_cron. Self-gates to counting day (4 May 2026) 8AM-10PM IST.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const COUNTING_DATE_IST = "2026-05-04"; // YYYY-MM-DD
const ACTIVE_HOUR_START = 8; // 08:00 IST
const ACTIVE_HOUR_END = 22; // 22:00 IST

const STATES = [
  { slug: "kerala", eciName: "Kerala", code: "S11" },
  { slug: "tamil-nadu", eciName: "Tamil Nadu", code: "S22" },
  { slug: "west-bengal", eciName: "West Bengal", code: "S25" },
  { slug: "assam", eciName: "Assam", code: "S03" },
  { slug: "puducherry", eciName: "Puducherry", code: "U07" },
];

// IST = UTC + 5:30
function nowIST(): { date: string; hour: number } {
  const now = new Date();
  const istMs = now.getTime() + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);
  const date = ist.toISOString().slice(0, 10);
  const hour = ist.getUTCHours();
  return { date, hour };
}

function isCountingWindow(): boolean {
  const { date, hour } = nowIST();
  if (date !== COUNTING_DATE_IST) return false;
  if (hour < ACTIVE_HOUR_START || hour >= ACTIVE_HOUR_END) return false;
  return true;
}

async function scrapeStateResults(state: typeof STATES[0]): Promise<any[]> {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY missing");

  const url = `https://results.eci.gov.in/AcResultGenJune2024/statewiseS${state.code}.htm`;
  // ECI URL pattern for assembly results — actual URL will be set on counting day
  const fallbackUrl = `https://results.eci.gov.in/`;

  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: [
        {
          type: "json",
          prompt:
            "Extract assembly constituency results. For each constituency, return: constituency_name, round_number, total_rounds, candidates: [{name, party, votes (integer), is_leading (boolean)}]. Return as JSON array under key 'constituencies'.",
        },
      ],
      onlyMainContent: true,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error(`[${state.slug}] Firecrawl ${res.status}: ${txt}`);
    return [];
  }
  const data = await res.json();
  const constituencies =
    data?.data?.json?.constituencies || data?.json?.constituencies || [];
  return constituencies;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Allow ?force=true for manual testing
  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "true";

  const active = isCountingWindow();
  if (!active && !force) {
    await supabase
      .from("live_status")
      .update({
        is_active: false,
        last_run_at: new Date().toISOString(),
        states_active: [],
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    return new Response(
      JSON.stringify({ active: false, message: "Outside counting window" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let totalRows = 0;
  const errors: string[] = [];
  const activeStates: string[] = [];

  for (const state of STATES) {
    try {
      const constituencies = await scrapeStateResults(state);
      if (!constituencies.length) continue;
      activeStates.push(state.slug);
      const fetchedAt = new Date().toISOString();
      const rows: any[] = [];
      for (const c of constituencies) {
        const cname = c.constituency_name?.trim();
        if (!cname) continue;
        for (const cand of c.candidates || []) {
          if (!cand.name) continue;
          rows.push({
            state_slug: state.slug,
            constituency: cname,
            candidate_name: cand.name.trim(),
            party: cand.party || null,
            alliance: cand.alliance || null,
            votes: Number(cand.votes) || 0,
            is_leading: !!cand.is_leading,
            round_number: c.round_number || null,
            total_rounds: c.total_rounds || null,
            fetched_at: fetchedAt,
          });
        }
      }
      if (rows.length) {
        const { error } = await supabase
          .from("live_results")
          .upsert(rows, { onConflict: "state_slug,constituency,candidate_name" });
        if (error) errors.push(`${state.slug}: ${error.message}`);
        else totalRows += rows.length;
      }
    } catch (e: any) {
      errors.push(`${state.slug}: ${e.message}`);
      console.error(`[${state.slug}]`, e);
    }
  }

  await supabase
    .from("live_status")
    .update({
      is_active: true,
      last_run_at: new Date().toISOString(),
      last_success_at: errors.length === 0 ? new Date().toISOString() : null,
      last_error: errors.length ? errors.join(" | ") : null,
      states_active: activeStates,
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  return new Response(
    JSON.stringify({ active: true, rowsUpdated: totalRows, errors, activeStates }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
