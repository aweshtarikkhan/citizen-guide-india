import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Star, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  rating: z.number().int().min(1, "Please rate").max(5),
  message: z.string().trim().min(5, "Please share a few words").max(1000),
});

interface Props {
  pageTitle?: string;
}

const FeedbackSection = ({ pageTitle }: Props) => {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, rating, message });
    if (!parsed.success) {
      toast({ title: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("submissions").insert({
      type: "feedback",
      name: parsed.data.name,
      email: parsed.data.email,
      rating: parsed.data.rating,
      message: parsed.data.message,
      page_path: pathname,
      page_title: pageTitle || document.title,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not submit feedback", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Thanks for your feedback!" });
  };

  return (
    <section className="border-t border-border bg-muted/30 py-10 md:py-14">
      <div className="container max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            <MessageSquare className="h-3.5 w-3.5" /> Was this page helpful?
          </div>
          <h3 className="text-2xl font-display font-bold">Share your feedback</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Help us make Matdaan better for every voter.
          </p>
        </div>

        {done ? (
          <div className="flex items-center justify-center gap-2 text-foreground py-8">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Thank you — your feedback has been recorded.</span>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      (hover || rating) >= n
                        ? "fill-foreground text-foreground"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={100}
                className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                maxLength={255}
                className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you like or what can we improve?"
              rows={3}
              maxLength={1000}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-muted-foreground">
                We will not send any promotional mail. Used only to follow up if needed.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;
