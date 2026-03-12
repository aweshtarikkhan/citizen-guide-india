import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { stateDataMap } from "@/data/stateConstituencies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Save, Loader2, MapPin, RotateCcw, Map } from "lucide-react";

interface Override {
  id?: string;
  constituency_name: string;
  state_id: string;
  mp_name: string | null;
  party: string | null;
}

const MAP_TYPE_OPTIONS = [
  { value: "leaflet", label: "Interactive Leaflet Map (GeoJSON boundaries)" },
  { value: "svg", label: "SVG Map (Static vector)" },
  { value: "png", label: "PNG Image Map (Static image)" },
  { value: "none", label: "No Map" },
];

const ConstituencyManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editMp, setEditMp] = useState("");
  const [editParty, setEditParty] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState("leaflet");
  const [savingMapType, setSavingMapType] = useState(false);

  // Load overrides and map setting
  useEffect(() => {
    fetchOverrides();
    fetchMapType();
  }, []);

  const fetchOverrides = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("constituency_overrides")
      .select("*");
    setOverrides((data as Override[]) || []);
    setLoading(false);
  };

  const fetchMapType = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "constituency_map_type")
      .single();
    if (data?.setting_value) {
      setMapType(typeof data.setting_value === "string" ? data.setting_value : JSON.stringify(data.setting_value).replace(/"/g, ""));
    }
  };

  const saveMapType = async (newType: string) => {
    setSavingMapType(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ setting_value: JSON.stringify(newType) as any, updated_at: new Date().toISOString() })
      .eq("setting_key", "constituency_map_type");
    if (error) {
      toast({ title: "Failed to save map type", description: error.message, variant: "destructive" });
    } else {
      setMapType(newType);
      toast({ title: `Map type changed to ${newType}` });
    }
    setSavingMapType(false);
  };

  // Build flat constituency list
  const allConstituencies = useMemo(() => {
    const result: { name: string; stateId: string; stateName: string; mp: string; party: string }[] = [];
    Object.values(stateDataMap).forEach((state) => {
      state.constituencies.forEach((c) => {
        const override = overrides.find(
          (o) => o.constituency_name === c.name && o.state_id === state.id
        );
        result.push({
          name: c.name,
          stateId: state.id,
          stateName: state.name,
          mp: override?.mp_name || c.mp,
          party: override?.party || c.party,
        });
      });
    });
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [overrides]);

  const filtered = useMemo(() => {
    return allConstituencies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mp.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = selectedState === "all" || c.stateId === selectedState;
      return matchesSearch && matchesState;
    });
  }, [allConstituencies, searchQuery, selectedState]);

  const startEdit = (c: typeof allConstituencies[0]) => {
    setEditingRow(`${c.stateId}-${c.name}`);
    setEditMp(c.mp);
    setEditParty(c.party);
  };

  const saveOverride = async (c: typeof allConstituencies[0]) => {
    setSaving(true);
    const existing = overrides.find(
      (o) => o.constituency_name === c.name && o.state_id === c.stateId
    );

    // Find original data to check if override is needed
    const originalState = stateDataMap[c.stateId];
    const originalC = originalState?.constituencies.find((x) => x.name === c.name);
    const isOriginal = editMp === originalC?.mp && editParty === originalC?.party;

    if (isOriginal && existing?.id) {
      // Remove override if back to original
      await supabase.from("constituency_overrides").delete().eq("id", existing.id);
      toast({ title: "Reset to original data" });
    } else if (!isOriginal) {
      if (existing?.id) {
        await supabase
          .from("constituency_overrides")
          .update({ mp_name: editMp, party: editParty, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("constituency_overrides")
          .insert({
            constituency_name: c.name,
            state_id: c.stateId,
            mp_name: editMp,
            party: editParty,
          } as any);
      }
      toast({ title: "Constituency updated!" });
    }

    setEditingRow(null);
    setSaving(false);
    fetchOverrides();
  };

  const resetOverride = async (c: typeof allConstituencies[0]) => {
    const existing = overrides.find(
      (o) => o.constituency_name === c.name && o.state_id === c.stateId
    );
    if (existing?.id) {
      await supabase.from("constituency_overrides").delete().eq("id", existing.id);
      toast({ title: "Reset to original" });
      fetchOverrides();
    }
  };

  const hasOverride = (name: string, stateId: string) =>
    overrides.some((o) => o.constituency_name === name && o.state_id === stateId);

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Constituency Management</h2>

      {/* Map Type Setting */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Map className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-semibold">Map Type</Label>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {MAP_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => saveMapType(opt.value)}
                disabled={savingMapType}
                className={`p-3 rounded-lg border text-sm text-left transition-all ${
                  mapType === opt.value
                    ? "border-primary bg-primary/10 text-foreground font-medium"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search constituency or MP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
        >
          <option value="all">All States</option>
          {Object.values(stateDataMap)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.totalConstituencies})
              </option>
            ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filtered.length} constituencies · {overrides.length} custom overrides
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filtered.map((c) => {
            const key = `${c.stateId}-${c.name}`;
            const isEditing = editingRow === key;
            const isOverridden = hasOverride(c.name, c.stateId);

            return (
              <Card key={key} className={`${isOverridden ? "border-primary/50" : ""}`}>
                <CardContent className="p-3">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{c.name}</span>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />{c.stateName}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">MP Name</Label>
                          <Input
                            value={editMp}
                            onChange={(e) => setEditMp(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Party</Label>
                          <Input
                            value={editParty}
                            onChange={(e) => setEditParty(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveOverride(c)} disabled={saving}>
                          <Save className="h-3 w-3 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingRow(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{c.name}</span>
                            {isOverridden && (
                              <Badge variant="default" className="text-[10px] px-1.5 py-0">edited</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{c.mp}</span>
                            <Badge variant="secondary" className="text-[10px]">{c.party}</Badge>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />{c.stateName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => startEdit(c)}>
                          Edit
                        </Button>
                        {isOverridden && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => resetOverride(c)}>
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConstituencyManager;
