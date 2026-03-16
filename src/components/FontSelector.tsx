import { useState, useEffect } from "react";
import { Type, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const fontOptions = [
  { label: "Quicksand", value: "'Quicksand', system-ui, sans-serif" },
  { label: "Poppins", value: "'Poppins', system-ui, sans-serif" },
  { label: "Roboto", value: "'Roboto', system-ui, sans-serif" },
  { label: "Lato", value: "'Lato', system-ui, sans-serif" },
  { label: "Nunito", value: "'Nunito', system-ui, sans-serif" },
  { label: "Source Sans 3", value: "'Source Sans 3', system-ui, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
];

export const applyGlobalFont = (fontLabel: string) => {
  const opt = fontOptions.find((f) => f.label === fontLabel);
  if (opt) {
    document.documentElement.style.setProperty("--font-display", opt.value);
    document.documentElement.style.setProperty("--font-body", opt.value);
  }
};

export const loadGlobalFont = async () => {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "global_font")
      .maybeSingle();
    if (data?.setting_value) {
      const fontLabel = (data.setting_value as any)?.font;
      if (fontLabel) applyGlobalFont(fontLabel);
    }
  } catch {
    // ignore
  }
};

const FontSelector = () => {
  const { toast } = useToast();
  const [currentFont, setCurrentFont] = useState("Quicksand");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "global_font")
        .maybeSingle();
      if (data?.setting_value) {
        const fontLabel = (data.setting_value as any)?.font;
        if (fontLabel) {
          setCurrentFont(fontLabel);
          applyGlobalFont(fontLabel);
        }
      }
    };
    load();
  }, []);

  const selectFont = async (opt: (typeof fontOptions)[0]) => {
    setSaving(true);
    applyGlobalFont(opt.label);
    setCurrentFont(opt.label);

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("setting_key", "global_font")
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ setting_value: { font: opt.label } as any })
        .eq("setting_key", "global_font");
    } else {
      await supabase
        .from("site_settings")
        .insert({ setting_key: "global_font", setting_value: { font: opt.label } as any });
    }

    toast({ title: `Font changed to ${opt.label}` });
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5" /> Website Font Style
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a font that will apply across the entire website for all visitors.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fontOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectFont(opt)}
              disabled={saving}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                currentFont === opt.label
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30 hover:bg-muted"
              }`}
            >
              {currentFont === opt.label && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-foreground" />
                </div>
              )}
              <span
                className="text-lg font-semibold block mb-1"
                style={{ fontFamily: opt.value }}
              >
                Aa
              </span>
              <span className="text-xs text-muted-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSelector;
