import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, BarChart3, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const STATE_ORDER = ["assam", "kerala", "puducherry", "tamil-nadu", "west-bengal"];

interface ExitPoll {
  id: string;
  agency: string;
  state_slug: string;
  state_name: string;
  total_seats: number | null;
  predictions: any;
  poll_date: string | null;
}

interface PollOfPolls {
  state_slug: string;
  state_name: string;
  total_seats: number | null;
  agencies_count: number;
  parties: { short: string; party: string; avg_seats: number; alliance?: string }[];
}

const allianceColor = (alliance?: string, short?: string) => {
  const a = (alliance || "").toUpperCase();
  const s = (short || "").toUpperCase();
  if (a === "NDA" || s === "NDA" || s === "BJP") return "bg-orange-500 text-white";
  if (a === "INDIA" || s.startsWith("INDIA") || s === "INC+" || s === "UDF") return "bg-blue-600 text-white";
  if (a === "LDF" || s === "LDF") return "bg-red-600 text-white";
  if (s === "TVK") return "bg-yellow-600 text-white";
  if (s === "TMC") return "bg-green-700 text-white";
  return "bg-foreground text-background";
};

const computePollOfPolls = (polls: ExitPoll[]): PollOfPolls[] => {
  const byState = new Map<string, ExitPoll[]>();
  polls.forEach((p) => {
    if (!byState.has(p.state_slug)) byState.set(p.state_slug, []);
    byState.get(p.state_slug)!.push(p);
  });

  const result: PollOfPolls[] = [];
  byState.forEach((statePolls, slug) => {
    const partyMap = new Map<string, { short: string; party: string; total: number; count: number; alliance?: string }>();
    statePolls.forEach((p) => {
      const preds = Array.isArray(p.predictions) ? p.predictions : [];
      preds.forEach((pred: any) => {
        const key = pred.short || pred.party;
        if (!key) return;
        const existing = partyMap.get(key);
        const seats = Number(pred.seats) || 0;
        if (existing) {
          existing.total += seats;
          existing.count += 1;
        } else {
          partyMap.set(key, { short: pred.short || pred.party, party: pred.party || pred.short, total: seats, count: 1, alliance: pred.alliance });
        }
      });
    });

    const parties = Array.from(partyMap.values())
      .map((p) => ({ short: p.short, party: p.party, alliance: p.alliance, avg_seats: Math.round(p.total / Math.max(1, p.count)) }))
      .sort((a, b) => b.avg_seats - a.avg_seats);

    result.push({
      state_slug: slug,
      state_name: statePolls[0].state_name,
      total_seats: statePolls[0].total_seats,
      agencies_count: statePolls.length,
      parties,
    });
  });

  // sort by predefined order
  return result.sort((a, b) => STATE_ORDER.indexOf(a.state_slug) - STATE_ORDER.indexOf(b.state_slug));
};

const FeaturedExitPolls = () => {
  const { data: polls } = useQuery({
    queryKey: ["allExitPollsForPoP"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exit_polls")
        .select("id, agency, state_slug, state_name, total_seats, predictions, poll_date")
        .in("state_slug", STATE_ORDER);
      if (error) throw error;
      return data as ExitPoll[];
    },
  });

  const slides = useMemo(() => (polls && polls.length ? computePollOfPolls(polls) : []), [polls]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  if (!slides.length) return null;
  const current = slides[index];

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container max-w-5xl">
        <div
          className="relative rounded-2xl border-2 border-foreground bg-gradient-to-br from-muted/40 via-background to-muted/20 p-6 md:p-8 shadow-elegant overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Poll of Polls — 2026 Assembly Elections
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Previous"
                onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                className="h-8 w-8 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next"
                onClick={() => setIndex((i) => (i + 1) % slides.length)}
                className="h-8 w-8 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Slide content */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-display font-bold">
                  {current.state_name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {current.total_seats ? `${current.total_seats} seats` : ""}
                  {current.total_seats && current.agencies_count ? " · " : ""}
                  {current.agencies_count ? `Avg of ${current.agencies_count} polls` : ""}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Aggregated prediction across all major agencies for the {current.state_name} 2026 Assembly Election.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {current.parties.slice(0, 5).map((p, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${allianceColor(p.alliance, p.short)}`}
                  >
                    {p.short}: {p.avg_seats}
                  </div>
                ))}
              </div>
              <Link
                to={`/upcoming-election/${current.state_slug}/exit-poll`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:gap-3 transition-all"
              >
                Compare All Exit Polls <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:flex h-24 w-24 rounded-full bg-foreground items-center justify-center shrink-0">
              <BarChart3 className="h-12 w-12 text-background" />
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {slides.map((s, i) => (
              <button
                key={s.state_slug}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${s.state_name}`}
                className={`transition-all rounded-full ${
                  i === index ? "w-6 h-2 bg-foreground" : "w-2 h-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExitPolls;
