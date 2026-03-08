import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Loader2, Search } from "lucide-react";
import { useLanguage, INDIAN_LANGUAGES } from "@/hooks/useLanguage";

const LanguageSelector = () => {
  const { currentLang, setLanguage, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const current = INDIAN_LANGUAGES.find((l) => l.code === currentLang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.includes(search)
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors text-foreground"
        title="Change Language"
      >
        {isTranslating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Globe className="h-4 w-4" />
        )}
        <span className="hidden sm:inline max-w-[60px] truncate">{current.nativeName}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-elevated overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg bg-muted border-0 outline-none focus:ring-1 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          {/* Language list */}
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                  currentLang === lang.code
                    ? "bg-foreground/5 font-semibold text-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{lang.name}</span>
                </div>
                {currentLang === lang.code && (
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No language found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
