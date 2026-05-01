import { useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Automatically translates all visible text nodes on the page
 * when the language changes. Call this in your page/layout component.
 */
const useAutoTranslate = () => {
  const { currentLang, t, translateBatch, isTranslating } = useLanguage();
  const originalTextsRef = useRef<Map<Node, string>>(new Map());
  const hasCollected = useRef(false);

  const collectTextNodes = useCallback(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.trim();
          if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
          // Skip script, style, input elements
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName?.toLowerCase();
          if (["script", "style", "noscript", "code", "pre"].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip inputs & buttons with type submit
          if (parent.closest("input, textarea, select")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const texts: string[] = [];
    const nodes: Node[] = [];

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text) {
        // Store original text only once
        if (!originalTextsRef.current.has(node)) {
          originalTextsRef.current.set(node, text);
        }
        texts.push(originalTextsRef.current.get(node)!);
        nodes.push(node);
      }
    }

    return { texts, nodes };
  }, []);

  const translatePage = useCallback(async () => {
    if (currentLang === "en") {
      // Restore originals
      originalTextsRef.current.forEach((originalText, node) => {
        if (node.textContent !== originalText) {
          node.textContent = originalText;
        }
      });
      return;
    }

    const { texts, nodes } = collectTextNodes();
    if (texts.length === 0) return;

    // Request translations
    await translateBatch(texts);

    // Apply translations after a tick
    requestAnimationFrame(() => {
      nodes.forEach((node, i) => {
        const original = originalTextsRef.current.get(node) || texts[i];
        const translated = t(original);
        if (translated !== node.textContent) {
          node.textContent = translated;
        }
      });
    });
  }, [currentLang, collectTextNodes, translateBatch, t]);

  // Translate when language changes or page content updates
  useEffect(() => {
    // Small delay to let page render first
    const timer = setTimeout(() => {
      translatePage();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentLang, translatePage]);

  // Re-translate when translations come back from API
  useEffect(() => {
    if (!isTranslating && currentLang !== "en") {
      requestAnimationFrame(() => {
        originalTextsRef.current.forEach((originalText, node) => {
          const translated = t(originalText);
          if (translated !== node.textContent) {
            node.textContent = translated;
          }
        });
      });
    }
  }, [isTranslating, t, currentLang]);

  // Observe DOM changes for dynamic content — only react to *added* nodes
  // (ignore characterData changes we cause ourselves). Heavy debounce to avoid CPU pinning.
  useEffect(() => {
    if (currentLang === "en") return;

    let timer: number | undefined;
    const observer = new MutationObserver((mutations) => {
      // Only react when new element subtrees are added — ignore text edits we
      // perform ourselves during translation (which would cause infinite loops).
      const hasNewNodes = mutations.some(
        (m) => m.type === "childList" && m.addedNodes.length > 0
      );
      if (!hasNewNodes) return;

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        translatePage();
      }, 1500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentLang, translatePage]);

  return { isTranslating };
};

export default useAutoTranslate;
