import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_FACTS = [
  { fact: "India's first general election in 1951-52 lasted 4 months and used ballot boxes with party symbols because most voters were illiterate.", emoji: "🗳️" },
  { fact: "Article 326 of the Indian Constitution guarantees universal adult suffrage — every citizen 18+ can vote regardless of caste, religion, or gender.", emoji: "📜" },
  { fact: "India has over 1 million polling stations, making it the largest democratic exercise in the world.", emoji: "🇮🇳" },
  { fact: "The Election Commission deploys a polling booth at Gir Forest for a single voter — because every vote matters.", emoji: "🦁" },
  { fact: "NOTA (None Of The Above) was introduced in Indian elections in 2013 after a Supreme Court ruling.", emoji: "⚖️" },
];

const DailyFact = () => {
  const [fact, setFact] = useState<{ fact: string; emoji: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("voting-assistant", {
        body: { type: "daily-fact" },
      });

      if (!error && data?.fact) {
        setFact(data);
        localStorage.setItem("matdaan-daily-fact", JSON.stringify({ ...data, date: new Date().toDateString() }));
      } else {
        throw new Error("No fact");
      }
    } catch {
      // Use cached or fallback
      const cached = localStorage.getItem("matdaan-daily-fact");
      if (cached) {
        const parsed = JSON.parse(cached);
        setFact(parsed);
      } else {
        const random = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
        setFact(random);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check if we already have today's fact cached
    const cached = localStorage.getItem("matdaan-daily-fact");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === new Date().toDateString()) {
        setFact(parsed);
        setLoading(false);
        return;
      }
    }
    fetchFact();
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-accent/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-foreground flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-background" />
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-foreground">Did You Know?</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Daily Democracy Fact</p>
            </div>
          </div>
          <button
            onClick={fetchFact}
            disabled={loading}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            aria-label="Get new fact"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {fact ? (
          <div className="flex gap-3 items-start">
            <span className="text-3xl shrink-0">{fact.emoji}</span>
            <p className="text-foreground text-sm md:text-base leading-relaxed">{fact.fact}</p>
          </div>
        ) : (
          <div className="h-12 bg-muted rounded-lg animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default DailyFact;
