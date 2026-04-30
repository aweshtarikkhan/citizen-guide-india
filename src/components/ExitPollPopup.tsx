import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, X, Sparkles } from "lucide-react";

interface PopupSetting {
  enabled?: boolean;
  start_date?: string | null; // ISO date
  duration_days?: number;
  title?: string;
  description?: string;
}

const ExitPollPopup = () => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<PopupSetting | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "exit_poll_popup")
      .maybeSingle()
      .then(({ data }) => {
        const cfg = (data?.setting_value as PopupSetting) || null;
        if (!cfg || !cfg.enabled || !cfg.start_date) return;

        const start = new Date(cfg.start_date);
        const days = cfg.duration_days || 3;
        const end = new Date(start);
        end.setDate(end.getDate() + days);
        const now = new Date();

        if (now >= start && now <= end) {
          setConfig(cfg);
          // Show on every page open / refresh — small delay for smoother UX
          const t = setTimeout(() => setOpen(true), 600);
          return () => clearTimeout(t);
        }
      });
  }, []);

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-2 border-foreground">
        <div className="bg-gradient-to-br from-foreground via-foreground to-foreground/90 text-background p-6 md:p-8 text-center relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 h-7 w-7 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/10 text-[10px] uppercase tracking-widest font-bold mb-4">
            <Sparkles className="h-3 w-3" /> Just In
          </div>

          <div className="h-16 w-16 mx-auto rounded-full bg-background flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-foreground" />
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            {config.title || "2026 Exit Polls Are Live"}
          </h2>
          <p className="text-sm text-background/80 mb-6 leading-relaxed">
            {config.description ||
              "Compare predictions from every leading agency for the 2026 state assembly elections — all in one place."}
          </p>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-background text-foreground hover:bg-background/90 font-semibold w-full"
            onClick={() => setOpen(false)}
          >
            <Link to="/exit-polls">
              View Exit Polls <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          <button
            onClick={() => setOpen(false)}
            className="text-xs text-background/60 hover:text-background mt-4 underline-offset-4 hover:underline"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitPollPopup;
