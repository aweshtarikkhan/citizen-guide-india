import { createContext, useContext, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const INDIAN_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
  { code: "ks", name: "Kashmiri", nativeName: "कॉशुर" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্" },
];

interface LanguageContextType {
  currentLang: string;
  setLanguage: (code: string) => void;
  t: (text: string) => string;
  translateBatch: (texts: string[]) => Promise<void>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: "en",
  setLanguage: () => {},
  t: (text) => text,
  translateBatch: async () => {},
  isTranslating: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("matdaan-lang") || "en";
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());

  const t = useCallback(
    (text: string): string => {
      if (currentLang === "en" || !text) return text;
      return translations[text] || text;
    },
    [currentLang, translations]
  );

  const translateBatch = useCallback(
    async (texts: string[]) => {
      if (currentLang === "en") return;

      // Filter out already translated and pending
      const newTexts = texts.filter(
        (t) => t && !translations[t] && !pendingRef.current.has(t)
      );
      if (newTexts.length === 0) return;

      newTexts.forEach((t) => pendingRef.current.add(t));
      setIsTranslating(true);

      try {
        // Process in batches of 20
        for (let i = 0; i < newTexts.length; i += 20) {
          const batch = newTexts.slice(i, i + 20);

          const { data, error } = await supabase.functions.invoke("translate", {
            body: { texts: batch, targetLang: currentLang },
          });

          if (!error && data?.translations) {
            const newTrans: Record<string, string> = {};
            batch.forEach((text, idx) => {
              if (data.translations[idx]) {
                newTrans[text] = data.translations[idx];
              }
            });
            setTranslations((prev) => ({ ...prev, ...newTrans }));
          }

          batch.forEach((t) => pendingRef.current.delete(t));
        }
      } catch {
        newTexts.forEach((t) => pendingRef.current.delete(t));
      }

      setIsTranslating(false);
    },
    [currentLang, translations]
  );

  const setLanguage = useCallback((code: string) => {
    localStorage.setItem("matdaan-lang", code);
    setCurrentLang(code);
    setTranslations({});
    pendingRef.current.clear();
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, translateBatch, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};
