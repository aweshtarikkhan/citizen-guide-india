import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Wraps text that should be translated.
 * Usage: <TranslatedText>Hello World</TranslatedText>
 * Or: <TranslatedText as="h1" className="text-xl">Title</TranslatedText>
 */
const TranslatedText = ({ children, as: Tag = "span", className }: TranslatedTextProps) => {
  const { t, translateBatch, currentLang } = useLanguage();

  useEffect(() => {
    if (currentLang !== "en" && children) {
      translateBatch([children]);
    }
  }, [children, currentLang, translateBatch]);

  return <Tag className={className}>{t(children)}</Tag>;
};

export default TranslatedText;
