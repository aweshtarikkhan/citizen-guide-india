import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
});

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast({ title: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("submissions").insert({
      type: "newsletter",
      email: parsed.data.email,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not subscribe", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    setEmail("");
    toast({ title: "Subscribed!", description: "Thanks for joining the Matdaan newsletter." });
  };

  return (
    <div>
      <h4 className="font-display font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
        <Mail className="h-4 w-4" /> Newsletter
      </h4>
      <p className="text-xs text-background/70 mb-3 leading-relaxed">
        Election updates & civic guides in your inbox. We will not send any promotional mail.
      </p>
      {done ? (
        <div className="flex items-center gap-2 text-sm text-background/80">
          <CheckCircle2 className="h-4 w-4" /> You're subscribed.
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-md bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-background/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 text-sm rounded-md bg-background text-foreground font-medium hover:bg-background/90 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup;
