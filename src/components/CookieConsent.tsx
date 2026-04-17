import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "matdaan_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const setChoice = (choice: "accepted" | "rejected") => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="relative bg-background border border-border shadow-2xl rounded-2xl p-5 md:p-6">
        <button
          onClick={() => setChoice("rejected")}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-base">We value your privacy</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Essential cookies only. No ads, no tracking.</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          We use cookies for authentication, language preferences, and to improve your experience on Matdaan. Read our{" "}
          <Link to="/cookie-policy" className="underline font-semibold text-foreground hover:opacity-70">
            Cookie Policy
          </Link>
          .
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setChoice("rejected")}>
            Reject Non-Essential
          </Button>
          <Button size="sm" className="flex-1" onClick={() => setChoice("accepted")}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
