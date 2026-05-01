import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Loader2, Info, Sparkles } from "lucide-react";

interface PartyPrediction {
  party: string;
  short?: string;
  seats?: number;
  margin?: number;
  alliance?: string;
}

interface ExitPoll {
  id: string;
  state_slug: string;
  state_name: string;
  agency: string;
  poll_date: string | null;
  sample_size: string | null;
  predictions: PartyPrediction[];
  is_featured: boolean;
  total_seats: number | null;
  source_url: string | null;
  sort_order: number;
}

const STATE_ORDER = ["west-bengal", "tamil-nadu", "kerala", "assam", "puducherry"];

const AllExitPolls = () => {
  const [polls, setPolls] = useState<ExitPoll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("exit_polls")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("poll_date", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setPolls(
            data.map((p: any) => ({
              ...p,
              predictions: Array.isArray(p.predictions) ? p.predictions : [],
            })),
          );
        }
        setLoading(false);
      });
  }, []);

  // Group by state
  const grouped = useMemo(() => {
    const map = new Map<string, ExitPoll[]>();
    for (const p of polls) {
      if (!map.has(p.state_slug)) map.set(p.state_slug, []);
      map.get(p.state_slug)!.push(p);
    }
    // Sort state keys by predefined order
    return Array.from(map.entries()).sort(
      (a, b) => STATE_ORDER.indexOf(a[0]) - STATE_ORDER.indexOf(b[0]),
    );
  }, [polls]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl py-10 md:py-14 mt-16">
        {/* Hero */}
        <section className="text-center mb-10 md:mb-14">
          <Badge variant="outline" className="mb-3">
            <BarChart3 className="h-3 w-3 mr-1" /> 2026 Assembly Exit Polls
          </Badge>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
            All Exit Polls — One Place
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Compare exit poll predictions from every leading agency, state by state, in
            simple tables. Exit polls are indicative — official results are declared by the ECI.
          </p>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : grouped.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Info className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-display font-semibold text-lg mb-1">
                No exit polls available yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Exit polls will appear here once polling concludes for the 2026 state assembly elections.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {grouped.map(([slug, statePolls]) => (
              <StateBlock key={slug} slug={slug} polls={statePolls} />
            ))}
          </div>
        )}

        <div className="mt-14 bg-muted/50 rounded-xl p-5 text-center text-xs text-muted-foreground">
          ⚠️ Exit polls are statistical projections by media/research agencies and may differ
          from final results. For official results, visit the{" "}
          <a
            href="https://results.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-foreground"
          >
            Election Commission of India
          </a>
          .
        </div>
      </main>
      <FeedbackSection />
      <FooterSection />
    </div>
  );
};

const StateBlock = ({ slug, polls }: { slug: string; polls: ExitPoll[] }) => {
  // Collect a stable union of party shorts across all polls for column headers
  const partyColumns = useMemo(() => {
    const seen = new Map<string, string>(); // short -> party name
    for (const p of polls) {
      for (const pred of p.predictions) {
        const key = (pred.short || pred.party || "").trim();
        if (key && !seen.has(key)) seen.set(key, pred.party || key);
      }
    }
    return Array.from(seen.entries()).map(([short, name]) => ({ short, name }));
  }, [polls]);

  const stateName = polls[0]?.state_name || slug;
  const totalSeats = polls.find((p) => p.total_seats)?.total_seats;

  return (
    <section>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">{stateName}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {polls.length} {polls.length === 1 ? "agency" : "agencies"}
            {totalSeats ? ` • Total: ${totalSeats} seats` : ""}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={`/upcoming-election/${slug}/exit-poll`}>
            View Detailed Page <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase">
              <tr>
                <th className="text-left p-3 font-semibold sticky left-0 bg-muted/60 min-w-[160px]">
                  Agency
                </th>
                {partyColumns.map((c) => (
                  <th key={c.short} className="text-right p-3 font-semibold whitespace-nowrap">
                    {c.short}
                    <span className="block text-[10px] font-normal text-muted-foreground normal-case">
                      {c.name !== c.short && c.name.length < 24 ? c.name : ""}
                    </span>
                  </th>
                ))}
                <th className="text-right p-3 font-semibold whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      {p.is_featured && (
                        <Sparkles className="h-3.5 w-3.5 text-foreground shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.agency}</div>
                        {p.poll_date && (
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(p.poll_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {partyColumns.map((c) => {
                    const pred = p.predictions.find(
                      (x) => (x.short || x.party || "").trim() === c.short,
                    );
                    return (
                      <td key={c.short} className="p-3 text-right tabular-nums">
                        {pred && pred.seats != null ? (
                          <span>
                            <span className="font-semibold">{pred.seats}</span>
                            {pred.margin != null && pred.margin > 0 && (
                              <span className="text-[10px] text-muted-foreground ml-0.5">
                                (±{pred.margin})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right text-xs text-muted-foreground tabular-nums">
                    {p.total_seats ?? totalSeats ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default AllExitPolls;
