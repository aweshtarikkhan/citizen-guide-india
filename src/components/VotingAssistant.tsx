import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };
const LEAD_KEY = "matdaan_chat_lead_v1";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voting-assistant`;

const quickQuestions = [
  "Voter ID kaise banaye?",
  "Polling booth kaise dhundein?",
  "EVM kya hai?",
  "NOTA kya hota hai?",
  "Voting ke liye kya documents chahiye?",
  "NRI voting kaise karein?",
  "Postal ballot kaise milega?",
  "Election mein complaint kaise karein?",
  "e-EPIC kya hai aur kaise download karein?",
  "Model Code of Conduct kya hota hai?",
  "Voter list mein naam kaise check karein?",
  "Senior citizens ke liye kya suvidha hai?",
];

const VotingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leadCaptured, setLeadCaptured] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(LEAD_KEY);
  });
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMobile, setLeadMobile] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submitLead = async (skip: boolean) => {
    if (skip) {
      localStorage.setItem(LEAD_KEY, "skipped");
      setLeadCaptured(true);
      return;
    }
    if (!leadName.trim() || !leadEmail.trim() || !leadMobile.trim()) return;
    setLeadSubmitting(true);
    const { error } = await supabase.from("submissions").insert({
      type: "chat_lead",
      name: leadName.trim().slice(0, 100),
      email: leadEmail.trim().slice(0, 255),
      mobile: leadMobile.trim().slice(0, 20),
    });
    setLeadSubmitting(false);
    if (!error) {
      localStorage.setItem(LEAD_KEY, "saved");
      setLeadCaptured(true);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    // Test mode: append ?testGroq=1 to the URL to force Groq provider
    const forceGroq = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("testGroq") === "1";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMsgs, ...(forceGroq ? { provider: "groq" } : {}) }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to connect");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again or call Voter Helpline 1950." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-foreground text-background shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open Voting Assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-elevated flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="px-4 py-3 bg-foreground text-background flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-full bg-background/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">Matdaan Assistant</p>
              <p className="text-xs opacity-70">Ask anything about voting</p>
            </div>
          </div>

          {/* Optional lead capture (skippable) */}
          {!leadCaptured && (
            <div className="px-4 py-3 border-b border-border bg-muted/40 space-y-2">
              <p className="text-xs font-medium text-foreground">Quick intro (optional)</p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Share your details so we can follow up if needed. We will not send any promotional mail.
              </p>
              <input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Name" maxLength={100} className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background" />
              <div className="grid grid-cols-2 gap-2">
                <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="Email" maxLength={255} className="px-2.5 py-1.5 text-xs rounded-md border border-border bg-background" />
                <input value={leadMobile} onChange={(e) => setLeadMobile(e.target.value)} placeholder="Mobile" maxLength={20} className="px-2.5 py-1.5 text-xs rounded-md border border-border bg-background" />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => submitLead(false)}
                  disabled={leadSubmitting || !leadName.trim() || !leadEmail.trim() || !leadMobile.trim()}
                  className="flex-1 px-3 py-1.5 text-xs rounded-md bg-foreground text-background font-medium disabled:opacity-40 hover:bg-foreground/90"
                >
                  {leadSubmitting ? "Saving..." : "Save & continue"}
                </button>
                <button
                  type="button"
                  onClick={() => submitLead(true)}
                  className="px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:bg-background"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-sm text-foreground">
                    Namaste! 🙏 Main aapka Matdaan Assistant hoon. Voting se related koi bhi sawaal puchiye!
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-9">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-foreground text-background"
                }`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-foreground text-background rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:mt-1 [&_ol]:mt-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2 items-start">
                <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="px-3 py-2 border-t border-border flex gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-9 w-9 rounded-lg bg-foreground text-background flex items-center justify-center disabled:opacity-40 hover:bg-foreground/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default VotingAssistant;
