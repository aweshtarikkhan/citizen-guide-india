import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, X, BarChart3, Star, Loader2 } from "lucide-react";
import ExitPollPopupSettings from "./ExitPollPopupSettings";

interface PartyPrediction {
  party: string;
  short?: string;
  seats?: number;
  margin?: number; // ± margin of error in seats
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
  sort_order: number;
  total_seats: number | null;
}

const STATES = [
  { slug: "assam", name: "Assam", totalSeats: 126 },
  { slug: "kerala", name: "Kerala", totalSeats: 140 },
  { slug: "puducherry", name: "Puducherry", totalSeats: 30 },
  { slug: "tamil-nadu", name: "Tamil Nadu", totalSeats: 234 },
  { slug: "west-bengal", name: "West Bengal", totalSeats: 294 },
];

const empty = (): Partial<ExitPoll> => ({
  state_slug: "",
  state_name: "",
  agency: "",
  poll_date: null,
  methodology: "",
  sample_size: "",
  predictions: [{ party: "", short: "", seats: 0, margin: 0 }],
  summary: "",
  source_url: "",
  is_featured: false,
  sort_order: 0,
  total_seats: null,
});

const ExitPollManager = () => {
  const { toast } = useToast();
  const [polls, setPolls] = useState<ExitPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ExitPoll> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterState, setFilterState] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("exit_polls")
      .select("*")
      .order("state_slug")
      .order("is_featured", { ascending: false })
      .order("sort_order");
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setPolls(
        (data || []).map((p: any) => ({
          ...p,
          predictions: Array.isArray(p.predictions) ? p.predictions : [],
        })),
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.state_slug || !editing.agency) {
      toast({ title: "Missing fields", description: "State and agency are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const stateMeta = STATES.find((s) => s.slug === editing.state_slug);
    const stateName = stateMeta?.name || editing.state_slug;
    const payload = {
      state_slug: editing.state_slug,
      state_name: stateName,
      agency: editing.agency,
      poll_date: editing.poll_date || null,
      methodology: editing.methodology || null,
      sample_size: editing.sample_size || null,
      predictions: (editing.predictions || []) as any,
      summary: editing.summary || null,
      source_url: editing.source_url || null,
      is_featured: !!editing.is_featured,
      sort_order: editing.sort_order ?? 0,
      total_seats: editing.total_seats ?? stateMeta?.totalSeats ?? null,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("exit_polls").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("exit_polls").insert(payload));
    }
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing.id ? "Updated" : "Created" });
      setEditing(null);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exit poll?")) return;
    const { error } = await supabase.from("exit_polls").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      load();
    }
  };

  const updatePrediction = (idx: number, field: keyof PartyPrediction, value: any) => {
    if (!editing) return;
    const list = [...(editing.predictions || [])];
    list[idx] = { ...list[idx], [field]: value };
    setEditing({ ...editing, predictions: list });
  };

  const addPredictionRow = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      predictions: [...(editing.predictions || []), { party: "", short: "", seats: 0, margin: 0 }],
    });
  };

  const removePredictionRow = (idx: number) => {
    if (!editing) return;
    const list = [...(editing.predictions || [])];
    list.splice(idx, 1);
    setEditing({ ...editing, predictions: list });
  };

  const filtered = filterState === "all" ? polls : polls.filter((p) => p.state_slug === filterState);

  if (editing) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">
            {editing.id ? "Edit" : "New"} Exit Poll
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>State *</Label>
              <Select
                value={editing.state_slug}
                onValueChange={(v) => setEditing({ ...editing, state_slug: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Agency / Media House *</Label>
              <Input
                value={editing.agency || ""}
                onChange={(e) => setEditing({ ...editing, agency: e.target.value })}
                placeholder="e.g., Chanakya, Axis My India, India Today-CVoter"
              />
            </div>
            <div>
              <Label>Poll Date</Label>
              <Input
                type="date"
                value={editing.poll_date || ""}
                onChange={(e) => setEditing({ ...editing, poll_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Sample Size</Label>
              <Input
                value={editing.sample_size || ""}
                onChange={(e) => setEditing({ ...editing, sample_size: e.target.value })}
                placeholder="e.g., 25,000 voters across 234 ACs"
              />
            </div>
            <div>
              <Label>Total Assembly Seats</Label>
              <Input
                type="number"
                value={editing.total_seats ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, total_seats: parseInt(e.target.value) || null })
                }
                placeholder="Auto-filled from state (e.g., 294)"
              />
            </div>
            <div className="md:col-span-1">
              <Label>&nbsp;</Label>
              <p className="text-xs text-muted-foreground">
                Predicted seats will be shown as <code>seats (±margin)</code> out of total.
              </p>
            </div>
            <div className="md:col-span-2">
              <Label>Source URL</Label>
              <Input
                value={editing.source_url || ""}
                onChange={(e) => setEditing({ ...editing, source_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <Label>Methodology</Label>
              <Input
                value={editing.methodology || ""}
                onChange={(e) => setEditing({ ...editing, methodology: e.target.value })}
                placeholder="e.g., Face-to-face interviews on poll day"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Summary</Label>
              <Textarea
                rows={3}
                value={editing.summary || ""}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                placeholder="One-paragraph headline takeaway from this exit poll."
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={!!editing.is_featured}
                onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })}
              />
              <Label className="!mb-0">Featured (highlighted on state page)</Label>
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Predictions */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">Party Predictions</h3>
              <Button variant="outline" size="sm" onClick={addPredictionRow}>
                <Plus className="h-4 w-4 mr-1" /> Add Party
              </Button>
            </div>
            <div className="space-y-2">
              {(editing.predictions || []).map((p, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-4"
                    placeholder="Party name"
                    value={p.party}
                    onChange={(e) => updatePrediction(i, "party", e.target.value)}
                  />
                  <Input
                    className="col-span-2"
                    placeholder="Short"
                    value={p.short || ""}
                    onChange={(e) => updatePrediction(i, "short", e.target.value)}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Seats"
                    value={p.seats ?? ""}
                    onChange={(e) =>
                      updatePrediction(i, "seats", parseInt(e.target.value) || 0)
                    }
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="± Margin"
                    value={p.margin ?? ""}
                    onChange={(e) =>
                      updatePrediction(i, "margin", parseInt(e.target.value) || 0)
                    }
                  />
                  <Input
                    className="col-span-1"
                    placeholder="Alliance"
                    value={p.alliance || ""}
                    onChange={(e) => updatePrediction(i, "alliance", e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="col-span-1"
                    onClick={() => removePredictionRow(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold">Exit Polls</h2>
          <p className="text-sm text-muted-foreground">
            Manage exit poll predictions per state. Mark one as featured per state to highlight it.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {STATES.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setEditing(empty())}>
            <Plus className="h-4 w-4 mr-2" /> New Exit Poll
          </Button>
        </div>
      </div>

      <ExitPollPopupSettings />
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No exit polls yet. Click "New Exit Poll" to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-card transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className="text-[10px]">
                      {p.state_name}
                    </Badge>
                    {p.is_featured && (
                      <Badge className="text-[10px]">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                    {p.poll_date && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(p.poll_date).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold truncate">{p.agency}</h3>
                  <p className="text-xs text-muted-foreground">
                    {p.predictions.length} parties •{" "}
                    {p.predictions.map((x) => `${x.short || x.party} ${x.seats ?? "?"}`).join(", ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(p)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExitPollManager;
