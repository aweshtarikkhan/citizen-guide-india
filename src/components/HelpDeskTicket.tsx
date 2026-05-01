import { useState } from "react";
import { LifeBuoy, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  mobile: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number"),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  constituency: z.string().trim().max(150).optional().or(z.literal("")),
  category: z.string().trim().min(1, "Pick a category"),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10, "Please describe your issue").max(2000),
});

const CATEGORIES = [
  "Voter ID / EPIC",
  "Voter list / Name correction",
  "Polling booth issue",
  "EVM / VVPAT",
  "Postal ballot / NRI",
  "Election complaint",
  "Candidate information",
  "Other",
];

const HelpDeskTicket = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    constituency: "",
    category: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("submissions").insert({
      type: "help_desk",
      name: parsed.data.name,
      email: parsed.data.email,
      mobile: parsed.data.mobile,
      state: parsed.data.state || null,
      constituency: parsed.data.constituency || null,
      category: parsed.data.category,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not submit ticket", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Ticket received", description: "Our team will reach out soon." });
  };

  if (done) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-foreground" />
        <h3 className="font-display font-bold text-xl mb-1">Ticket submitted</h3>
        <p className="text-sm text-muted-foreground">
          We've received your query. The Matdaan help desk will respond to your email within 2 working days.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-7">
      <div className="flex items-center gap-2 mb-1">
        <LifeBuoy className="h-5 w-5" />
        <h3 className="font-display font-bold text-xl">Voter Help Desk Ticket</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Have a specific question? Raise a ticket and we'll get back to you. We will not send any promotional mail.
      </p>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input required maxLength={100} placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} className="px-3 py-2 text-sm rounded-md border border-border bg-background" />
          <input required type="email" maxLength={255} placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className="px-3 py-2 text-sm rounded-md border border-border bg-background" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input required placeholder="Mobile number" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className="px-3 py-2 text-sm rounded-md border border-border bg-background" />
          <select required value={form.category} onChange={(e) => set("category", e.target.value)} className="px-3 py-2 text-sm rounded-md border border-border bg-background">
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input maxLength={100} placeholder="State (optional)" value={form.state} onChange={(e) => set("state", e.target.value)} className="px-3 py-2 text-sm rounded-md border border-border bg-background" />
          <input maxLength={150} placeholder="Constituency (optional)" value={form.constituency} onChange={(e) => set("constituency", e.target.value)} className="px-3 py-2 text-sm rounded-md border border-border bg-background" />
        </div>
        <input required maxLength={200} placeholder="Subject — short summary" value={form.subject} onChange={(e) => set("subject", e.target.value)} className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background" />
        <textarea required rows={4} maxLength={2000} placeholder="Describe your specific question or problem in detail..." value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background" />
        <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 text-sm rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 disabled:opacity-50 inline-flex items-center justify-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit ticket
        </button>
      </form>
    </div>
  );
};

export default HelpDeskTicket;
