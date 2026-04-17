import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, TrendingUp, Trophy } from "lucide-react";

interface LiveResult {
  id: string;
  state_slug: string;
  constituency: string;
  candidate_name: string;
  party: string | null;
  alliance: string | null;
  votes: number;
  is_leading: boolean;
  round_number: number | null;
  total_rounds: number | null;
  fetched_at: string;
}

interface Props {
  stateSlug: string;
}

const LiveResultsPanel = ({ stateSlug }: Props) => {
  const [rows, setRows] = useState<LiveResult[]>([]);
  const [active, setActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      const { data } = await supabase
        .from("live_status")
        .select("is_active, last_success_at, states_active")
        .limit(1)
        .single();
      if (!mounted || !data) return;
      const isStateActive =
        data.is_active && (data.states_active || []).includes(stateSlug);
      setActive(isStateActive);
    };

    const loadResults = async () => {
      const { data } = await supabase
        .from("live_results")
        .select("*")
        .eq("state_slug", stateSlug)
        .order("votes", { ascending: false });
      if (!mounted || !data) return;
      setRows(data as LiveResult[]);
      if (data[0]?.fetched_at) setLastUpdate(data[0].fetched_at);
    };

    loadStatus();
    loadResults();

    const ch = supabase
      .channel(`live-results-${stateSlug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_results", filter: `state_slug=eq.${stateSlug}` },
        () => loadResults()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_status" },
        () => loadStatus()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, [stateSlug]);

  if (!active && rows.length === 0) return null;

  // Group by constituency, top 3 candidates each
  const grouped = rows.reduce<Record<string, LiveResult[]>>((acc, r) => {
    (acc[r.constituency] = acc[r.constituency] || []).push(r);
    return acc;
  }, {});
  const constituencies = Object.entries(grouped)
    .map(([name, cands]) => ({
      name,
      cands: cands.sort((a, b) => b.votes - a.votes).slice(0, 3),
      round: cands[0]?.round_number,
      totalRounds: cands[0]?.total_rounds,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Aggregate alliance leads
  const allianceLeads: Record<string, number> = {};
  Object.values(grouped).forEach((cands) => {
    const top = cands.sort((a, b) => b.votes - a.votes)[0];
    if (top?.alliance) allianceLeads[top.alliance] = (allianceLeads[top.alliance] || 0) + 1;
  });

  return (
    <section className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
        </span>
        <h2 className="text-3xl font-bold">LIVE Counting</h2>
        <Badge variant="destructive" className="uppercase tracking-wide">
          <Radio className="h-3 w-3 mr-1" /> On Air
        </Badge>
        {lastUpdate && (
          <span className="text-xs text-muted-foreground ml-auto">
            Updated {new Date(lastUpdate).toLocaleTimeString("en-IN")}
          </span>
        )}
      </div>

      {/* Alliance lead summary */}
      {Object.keys(allianceLeads).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(allianceLeads)
            .sort((a, b) => b[1] - a[1])
            .map(([alliance, leads]) => (
              <Card key={alliance}>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">
                    {alliance}
                  </p>
                  <p className="text-3xl font-bold mt-1 flex items-center gap-2">
                    {leads}
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </p>
                  <p className="text-xs text-muted-foreground">Leading / Won</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Constituency cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {constituencies.map((c) => (
          <Card key={c.name} className="border-l-4 border-l-red-600">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
                {c.round && (
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    R {c.round}/{c.totalRounds || "?"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {c.cands.map((cand, i) => (
                <div
                  key={cand.id}
                  className={`flex items-center justify-between gap-2 p-2 rounded-md text-sm ${
                    i === 0 ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900" : "bg-muted/50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 font-medium truncate">
                      {i === 0 && <Trophy className="h-3 w-3 text-green-700 shrink-0" />}
                      {cand.candidate_name}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide opacity-70">
                      {cand.party} {cand.alliance && `· ${cand.alliance}`}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm">
                    {cand.votes.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LiveResultsPanel;
