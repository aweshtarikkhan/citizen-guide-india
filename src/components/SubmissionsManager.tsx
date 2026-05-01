import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Star, Mail, MessageSquare, LifeBuoy, Bot, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  type: "newsletter" | "feedback" | "help_desk" | "chat_lead";
  name: string | null;
  email: string | null;
  mobile: string | null;
  rating: number | null;
  page_path: string | null;
  page_title: string | null;
  message: string | null;
  subject: string | null;
  category: string | null;
  constituency: string | null;
  state: string | null;
  status: string;
  created_at: string;
}

const FILTERS = [
  { id: "all", label: "All", icon: Mail },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "help_desk", label: "Help Desk", icon: LifeBuoy },
  { id: "chat_lead", label: "Chat Leads", icon: Bot },
] as const;

const SubmissionsManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setItems((data as Submission[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => { c[i.type] = (c[i.type] || 0) + 1; });
    return c;
  }, [items]);

  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const exportCsv = () => {
    const rows = filtered;
    if (!rows.length) return;
    const headers = ["created_at","type","name","email","mobile","rating","subject","category","state","constituency","page_path","message"];
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g," ")}"`;
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape((r as any)[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `submissions-${filter}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold">Submissions</h2>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                active ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
              <span className="ml-1 opacity-70">({counts[f.id] || 0})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className="text-xs uppercase">{s.type.replace("_", " ")}</Badge>
                    {s.rating && (
                      <span className="inline-flex items-center gap-0.5 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < (s.rating || 0) ? "fill-foreground text-foreground" : "text-muted-foreground/30"}`} />
                        ))}
                      </span>
                    )}
                    {s.category && <Badge variant="secondary" className="text-xs">{s.category}</Badge>}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(s.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  {s.name && <p className="font-medium text-sm">{s.name}</p>}
                  <p className="text-xs text-muted-foreground mb-1">
                    {[s.email, s.mobile].filter(Boolean).join(" · ")}
                  </p>
                  {s.subject && <p className="text-sm font-medium mt-1">{s.subject}</p>}
                  {(s.state || s.constituency) && (
                    <p className="text-xs text-muted-foreground">
                      {[s.state, s.constituency].filter(Boolean).join(" / ")}
                    </p>
                  )}
                  {s.page_path && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Page: <span className="font-mono">{s.page_path}</span>
                      {s.page_title && ` — ${s.page_title}`}
                    </p>
                  )}
                  {s.message && (
                    <p className="text-sm mt-2 whitespace-pre-wrap text-foreground/80">{s.message}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsManager;
