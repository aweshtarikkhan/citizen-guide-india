import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Users,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Loader2,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PartyPrediction {
  party: string;
  short?: string;
  seats?: number;
  vote_share?: number;
  alliance?: string;
}

interface ExitPoll {
  id: string;
  state_slug: string;
  state_name: string;
  agency: string;
  poll_date: string | null;
  methodology: string | null;
  sample_size: string | null;
  predictions: PartyPrediction[];
  summary: string | null;
  source_url: string | null;
  is_featured: boolean;
}

const STATE_NAMES: Record<string, string> = {
  "assam": "Assam",
  "kerala": "Kerala",
  "puducherry": "Puducherry",
  "tamil-nadu": "Tamil Nadu",
  "west-bengal": "West Bengal",
};

// Color helper for party bars (B&W with brand accents per memory rules)
const partyColor = (short?: string, idx = 0) => {
  const map: Record<string, string> = {
    BJP: "hsl(24 95% 53%)",
    INC: "hsl(217 91% 50%)",
    AITC: "hsl(142 71% 45%)",
    TMC: "hsl(142 71% 45%)",
    DMK: "hsl(0 84% 55%)",
    AIADMK: "hsl(142 60% 35%)",
    LDF: "hsl(0 75% 45%)",
    UDF: "hsl(217 91% 50%)",
    AIUDF: "hsl(142 60% 35%)",
    NDA: "hsl(24 95% 53%)",
    INDIA: "hsl(217 91% 50%)",
    AINRC: "hsl(280 65% 50%)",
  };
  if (short && map[short.toUpperCase()]) return map[short.toUpperCase()];
  const fallback = ["hsl(220 9% 20%)", "hsl(220 9% 40%)", "hsl(220 9% 60%)", "hsl(220 9% 75%)"];
  return fallback[idx % fallback.length];
};

const ExitPollPage = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const [polls, setPolls] = useState<ExitPoll[]>([]);
  const [loading, setLoading] = useState(true);

  const stateName = stateSlug ? STATE_NAMES[stateSlug] ?? stateSlug : "";

  useEffect(() => {
    if (!stateSlug) return;
    setLoading(true);
    supabase
      .from("exit_polls")
      .select("*")
      .eq("state_slug", stateSlug)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("poll_date", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setPolls(
            data.map((p: any) => ({
              ...p,
              predictions: Array.isArray(p.predictions) ? p.predictions : [],
            })),
          );
        }
        setLoading(false);
      });
  }, [stateSlug]);

  const featured = useMemo(() => polls.find((p) => p.is_featured), [polls]);
  const others = useMemo(() => polls.filter((p) => p.id !== featured?.id), [polls, featured]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-6xl py-10 md:py-14">
        <Link
          to={`/upcoming-election/${stateSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {stateName} Election
        </Link>

        {/* Hero */}
        <section className="text-center mb-10">
          <Badge variant="outline" className="mb-3">
            <BarChart3 className="h-3 w-3 mr-1" /> Exit Polls
          </Badge>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
            {stateName} Exit Polls 2026
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Compare predictions from leading agencies and media houses. Exit polls are
            indicative, not official — actual results are declared by the Election Commission of India.
          </p>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : polls.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Info className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-display font-semibold text-lg mb-1">
                No exit polls available yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Exit polls will be published here once polling concludes for {stateName}.
                Check back closer to the election date.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Featured Exit Poll
                  </span>
                </div>
                <PollCard poll={featured} highlighted />
              </section>
            )}

            {/* Other polls grid */}
            {others.length > 0 && (
              <section>
                <h2 className="text-xl md:text-2xl font-display font-bold mb-5">
                  All Agencies ({others.length})
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {others.map((p) => (
                    <PollCard key={p.id} poll={p} />
                  ))}
                </div>
              </section>
            )}
          </>
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
      <FooterSection />
    </div>
  );
};

const PollCard = ({ poll, highlighted = false }: { poll: ExitPoll; highlighted?: boolean }) => {
  const chartData = poll.predictions.map((p, i) => ({
    name: p.short || p.party,
    seats: p.seats || 0,
    fill: partyColor(p.short, i),
  }));
  const totalSeats = chartData.reduce((a, b) => a + b.seats, 0);
  const winner = [...poll.predictions].sort((a, b) => (b.seats || 0) - (a.seats || 0))[0];

  return (
    <Card
      className={`transition-all ${
        highlighted
          ? "border-2 border-foreground shadow-elegant"
          : "border-border hover:shadow-card"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg md:text-xl font-display">{poll.agency}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
              {poll.poll_date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(poll.poll_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {poll.sample_size && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Sample: {poll.sample_size}
                </span>
              )}
            </div>
          </div>
          {highlighted && (
            <Badge className="shrink-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {winner && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" /> Projected Winner
            </div>
            <div className="font-semibold">
              {winner.party}{" "}
              <span className="text-muted-foreground font-normal">
                — {winner.seats} seats
                {totalSeats > 0 && ` (${Math.round(((winner.seats || 0) / totalSeats) * 100)}%)`}
              </span>
            </div>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="seats" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Detailed table */}
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase">
              <tr>
                <th className="text-left p-2 font-medium">Party</th>
                <th className="text-right p-2 font-medium">Seats</th>
                <th className="text-right p-2 font-medium">Vote %</th>
              </tr>
            </thead>
            <tbody>
              {poll.predictions.map((p, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2 font-medium">{p.party}</td>
                  <td className="p-2 text-right">{p.seats ?? "—"}</td>
                  <td className="p-2 text-right text-muted-foreground">
                    {p.vote_share != null ? `${p.vote_share}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {poll.methodology && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Methodology: </span>
            {poll.methodology}
          </p>
        )}
        {poll.summary && <p className="text-sm text-muted-foreground">{poll.summary}</p>}

        {poll.source_url && (
          <a
            href={poll.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
          >
            View source <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default ExitPollPage;
