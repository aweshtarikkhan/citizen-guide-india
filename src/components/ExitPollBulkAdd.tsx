import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X, Loader2, Layers } from "lucide-react";

const STATES = [
  { slug: "assam", name: "Assam", totalSeats: 126 },
  { slug: "kerala", name: "Kerala", totalSeats: 140 },
  { slug: "puducherry", name: "Puducherry", totalSeats: 30 },
  { slug: "tamil-nadu", name: "Tamil Nadu", totalSeats: 234 },
  { slug: "west-bengal", name: "West Bengal", totalSeats: 294 },
];

interface PartyRow {
  party: string;
  short: string;
  alliance: string;
}

interface AgencyCol {
  agency: string;
  poll_date: string;
  sample_size: string;
  source_url: string;
  is_featured: boolean;
  // values keyed by party row index -> { seats, margin }
  values: Record<number, { seats: string; margin: string }>;
}

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const DRAFT_KEY = "exit_poll_bulk_draft_v1";

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ExitPollBulkAdd = ({ onClose, onSaved }: Props) => {
  const { toast } = useToast();
  const draft = loadDraft();
  const [stateSlug, setStateSlug] = useState<string>(draft?.stateSlug || "");
  const [totalSeats, setTotalSeats] = useState<string>(draft?.totalSeats || "");
  const [parties, setParties] = useState<PartyRow[]>(
    draft?.parties || [
      { party: "Indian National Congress", short: "INC", alliance: "INDIA" },
      { party: "", short: "", alliance: "" },
    ],
  );
  const [agencies, setAgencies] = useState<AgencyCol[]>(
    draft?.agencies || [
      {
        agency: "",
        poll_date: "",
        sample_size: "",
        source_url: "",
        is_featured: false,
        values: {},
      },
    ],
  );
  const [saving, setSaving] = useState(false);

  const persist = (next: any) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const sync = (
    s = stateSlug,
    ts = totalSeats,
    ps = parties,
    ag = agencies,
  ) => persist({ stateSlug: s, totalSeats: ts, parties: ps, agencies: ag });

  const handleStateChange = (v: string) => {
    setStateSlug(v);
    const meta = STATES.find((s) => s.slug === v);
    const ts = meta ? String(meta.totalSeats) : totalSeats;
    setTotalSeats(ts);
    sync(v, ts);
  };

  const updateParty = (i: number, field: keyof PartyRow, value: string) => {
    const next = [...parties];
    next[i] = { ...next[i], [field]: value };
    setParties(next);
    sync(stateSlug, totalSeats, next);
  };

  const addParty = () => {
    const next = [...parties, { party: "", short: "", alliance: "" }];
    setParties(next);
    sync(stateSlug, totalSeats, next);
  };

  const removeParty = (i: number) => {
    const next = parties.filter((_, idx) => idx !== i);
    // remap agency values
    const ag = agencies.map((a) => {
      const newVals: Record<number, { seats: string; margin: string }> = {};
      Object.keys(a.values).forEach((k) => {
        const oldIdx = parseInt(k);
        if (oldIdx === i) return;
        const newIdx = oldIdx > i ? oldIdx - 1 : oldIdx;
        newVals[newIdx] = a.values[oldIdx];
      });
      return { ...a, values: newVals };
    });
    setParties(next);
    setAgencies(ag);
    sync(stateSlug, totalSeats, next, ag);
  };

  const updateAgency = (
    i: number,
    field: keyof AgencyCol,
    value: any,
  ) => {
    const next = [...agencies];
    (next[i] as any)[field] = value;
    setAgencies(next);
    sync(stateSlug, totalSeats, parties, next);
  };

  const updateAgencyValue = (
    agencyIdx: number,
    partyIdx: number,
    field: "seats" | "margin",
    value: string,
  ) => {
    const next = [...agencies];
    const cur = next[agencyIdx].values[partyIdx] || { seats: "", margin: "" };
    next[agencyIdx] = {
      ...next[agencyIdx],
      values: { ...next[agencyIdx].values, [partyIdx]: { ...cur, [field]: value } },
    };
    setAgencies(next);
    sync(stateSlug, totalSeats, parties, next);
  };

  const addAgency = () => {
    const next = [
      ...agencies,
      {
        agency: "",
        poll_date: "",
        sample_size: "",
        source_url: "",
        is_featured: false,
        values: {},
      },
    ];
    setAgencies(next);
    sync(stateSlug, totalSeats, parties, next);
  };

  const removeAgency = (i: number) => {
    const next = agencies.filter((_, idx) => idx !== i);
    setAgencies(next);
    sync(stateSlug, totalSeats, parties, next);
  };

  const handleSave = async () => {
    if (!stateSlug) {
      toast({ title: "Pick a state", variant: "destructive" });
      return;
    }
    const validAgencies = agencies.filter((a) => a.agency.trim());
    if (validAgencies.length === 0) {
      toast({ title: "Add at least one agency", variant: "destructive" });
      return;
    }
    const validParties = parties.filter((p) => p.party.trim());
    if (validParties.length === 0) {
      toast({ title: "Add at least one party", variant: "destructive" });
      return;
    }

    const stateMeta = STATES.find((s) => s.slug === stateSlug);
    const stateName = stateMeta?.name || stateSlug;
    const total = parseInt(totalSeats) || stateMeta?.totalSeats || null;

    const rows = validAgencies.map((a, agencyIdx) => {
      // find original index in agencies array for value lookup
      const originalIdx = agencies.indexOf(a);
      const predictions = validParties.map((p) => {
        const origPartyIdx = parties.indexOf(p);
        const v = a.values[origPartyIdx] || { seats: "", margin: "" };
        return {
          party: p.party,
          short: p.short || undefined,
          alliance: p.alliance || undefined,
          seats: parseInt(v.seats) || 0,
          margin: parseInt(v.margin) || 0,
        };
      });
      return {
        state_slug: stateSlug,
        state_name: stateName,
        agency: a.agency,
        poll_date: a.poll_date || null,
        sample_size: a.sample_size || null,
        source_url: a.source_url || null,
        is_featured: a.is_featured,
        sort_order: agencyIdx,
        total_seats: total,
        predictions: predictions as any,
        methodology: null,
        summary: null,
      };
    });

    setSaving(true);
    const { error } = await supabase.from("exit_polls").insert(rows);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Saved",
      description: `${rows.length} exit poll${rows.length > 1 ? "s" : ""} created.`,
    });
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    onSaved();
  };

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Layers className="h-6 w-6" /> Bulk Add — Multi-Agency Exit Polls
          </h2>
          <p className="text-sm text-muted-foreground">
            Define parties once, then enter seat predictions from multiple agencies side-by-side.
            Each agency saves as a separate exit poll entry.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>State *</Label>
          <Select value={stateSlug} onValueChange={handleStateChange}>
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
          <Label>Total Assembly Seats</Label>
          <Input
            type="number"
            value={totalSeats}
            onChange={(e) => {
              setTotalSeats(e.target.value);
              sync(stateSlug, e.target.value);
            }}
            placeholder="Auto-filled from state"
          />
        </div>
      </div>

      {/* Parties */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Parties (rows)</h3>
          <Button variant="outline" size="sm" onClick={addParty}>
            <Plus className="h-4 w-4 mr-1" /> Add Party
          </Button>
        </div>
        <div className="space-y-2">
          {parties.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <Input
                className="col-span-5"
                placeholder="Party name (e.g., BJP)"
                value={p.party}
                onChange={(e) => updateParty(i, "party", e.target.value)}
              />
              <Input
                className="col-span-3"
                placeholder="Short (BJP)"
                value={p.short}
                onChange={(e) => updateParty(i, "short", e.target.value)}
              />
              <Input
                className="col-span-3"
                placeholder="Alliance (NDA)"
                value={p.alliance}
                onChange={(e) => updateParty(i, "alliance", e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="col-span-1"
                onClick={() => removeParty(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Agencies grid */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Agencies (columns)</h3>
          <Button variant="outline" size="sm" onClick={addAgency}>
            <Plus className="h-4 w-4 mr-1" /> Add Agency
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left p-2 font-medium align-top w-44 sticky left-0 bg-background">
                  Field / Party
                </th>
                {agencies.map((a, i) => (
                  <th key={i} className="text-left p-2 font-medium align-top min-w-[220px]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Agency #{i + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeAgency(i)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Agency name *"
                      value={a.agency}
                      onChange={(e) => updateAgency(i, "agency", e.target.value)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2 text-xs text-muted-foreground sticky left-0 bg-background">
                  Poll date
                </td>
                {agencies.map((a, i) => (
                  <td key={i} className="p-2">
                    <Input
                      type="date"
                      value={a.poll_date}
                      onChange={(e) => updateAgency(i, "poll_date", e.target.value)}
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-xs text-muted-foreground sticky left-0 bg-background">
                  Sample size
                </td>
                {agencies.map((a, i) => (
                  <td key={i} className="p-2">
                    <Input
                      placeholder="e.g. 25,000"
                      value={a.sample_size}
                      onChange={(e) => updateAgency(i, "sample_size", e.target.value)}
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-xs text-muted-foreground sticky left-0 bg-background">
                  Source URL
                </td>
                {agencies.map((a, i) => (
                  <td key={i} className="p-2">
                    <Input
                      placeholder="https://..."
                      value={a.source_url}
                      onChange={(e) => updateAgency(i, "source_url", e.target.value)}
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-xs text-muted-foreground sticky left-0 bg-background">
                  Featured
                </td>
                {agencies.map((a, i) => (
                  <td key={i} className="p-2">
                    <Switch
                      checked={a.is_featured}
                      onCheckedChange={(v) => updateAgency(i, "is_featured", v)}
                    />
                  </td>
                ))}
              </tr>

              {parties.map((p, pi) => (
                <tr key={pi} className="border-t bg-muted/20">
                  <td className="p-2 sticky left-0 bg-muted/40">
                    <div className="font-semibold text-sm">{p.party || `Party ${pi + 1}`}</div>
                    {p.short && (
                      <div className="text-[10px] text-muted-foreground">{p.short}</div>
                    )}
                  </td>
                  {agencies.map((a, ai) => {
                    const v = a.values[pi] || { seats: "", margin: "" };
                    return (
                      <td key={ai} className="p-2">
                        <div className="grid grid-cols-2 gap-1">
                          <Input
                            type="number"
                            placeholder="Seats"
                            value={v.seats}
                            onChange={(e) =>
                              updateAgencyValue(ai, pi, "seats", e.target.value)
                            }
                          />
                          <Input
                            type="number"
                            placeholder="± Margin"
                            value={v.margin}
                            onChange={(e) =>
                              updateAgencyValue(ai, pi, "margin", e.target.value)
                            }
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Tip: Empty seats default to 0. Each agency column will save as a separate exit poll
          row, sharing the same parties and state.
        </p>
      </div>
    </div>
  );
};

export default ExitPollBulkAdd;
