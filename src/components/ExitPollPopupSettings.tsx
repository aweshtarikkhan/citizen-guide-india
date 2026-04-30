import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Save, Loader2, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PopupConfig {
  enabled: boolean;
  start_date: string | null;
  duration_days: number;
  title: string;
  description: string;
}

const defaults: PopupConfig = {
  enabled: false,
  start_date: null,
  duration_days: 3,
  title: "2026 Exit Polls Are Live",
  description:
    "Compare predictions from every leading agency for the 2026 state assembly elections — all in one place.",
};

const ExitPollPopupSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PopupConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "exit_poll_popup")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.setting_value) {
          setConfig({ ...defaults, ...(data.setting_value as any) });
        }
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    // Upsert by setting_key
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("setting_key", "exit_poll_popup")
      .maybeSingle();

    const payload = {
      setting_key: "exit_poll_popup",
      setting_value: config as any,
    };

    const { error } = existing
      ? await supabase.from("site_settings").update(payload).eq("id", existing.id)
      : await supabase.from("site_settings").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Popup settings saved" });
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const start = config.start_date ? new Date(config.start_date) : null;
  const end =
    start ? new Date(start.getTime() + config.duration_days * 86400000) : null;
  const now = new Date();
  const isLive =
    config.enabled && start && end && now >= start && now <= end;

  return (
    <Card className="mb-6 border-2">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
            <Megaphone className="h-5 w-5 text-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg">Homepage Popup Banner</h3>
            <p className="text-xs text-muted-foreground">
              When enabled, a popup appears on every homepage visit/refresh for{" "}
              {config.duration_days} days from the start date, linking to the All Exit Polls page.
            </p>
            {isLive && (
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                ● LIVE NOW
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-center gap-3">
            <Switch
              checked={config.enabled}
              onCheckedChange={(v) => setConfig({ ...config, enabled: v })}
            />
            <Label className="!mb-0">Enable popup banner</Label>
          </div>

          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !start && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {start ? format(start, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={start || undefined}
                  onSelect={(d) =>
                    setConfig({
                      ...config,
                      start_date: d ? d.toISOString() : null,
                    })
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Duration (days)</Label>
            <Input
              type="number"
              min={1}
              max={30}
              value={config.duration_days}
              onChange={(e) =>
                setConfig({
                  ...config,
                  duration_days: parseInt(e.target.value) || 3,
                })
              }
            />
            {end && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Auto-ends on {format(end, "PPP")}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Popup Title</Label>
            <Input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="2026 Exit Polls Are Live"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Popup Description</Label>
            <Textarea
              rows={2}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Popup Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExitPollPopupSettings;
