import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Coach — CareerConnect" }] }),
  component: AiAssistant,
});

const suggestions = [
  "Review my resume — what should I improve?",
  "Suggest a 4-week learning plan to become a Frontend Engineer.",
  "Give me 5 likely HR interview questions with strong answers.",
  "What roles match a CGPA of 8.4 with React and Node skills?",
];

function AiAssistant() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient text-white shadow"><Bot className="h-5 w-5" /></div>
        <div>
          <h1 className="text-2xl font-bold">AI Career Coach</h1>
          <p className="text-xs text-muted-foreground">Powered by Lovable AI</p>
        </div>
      </div>

      <Card className="glass relative flex-1 overflow-y-auto border-0 p-5">
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center">
            <div className="max-w-md text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[oklch(0.68_0.22_265)]" />
              <h2 className="mt-3 text-lg font-semibold">How can I help your career today?</h2>
              <div className="mt-5 grid gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-xl border border-border/50 bg-card/40 px-3 py-2 text-left text-sm hover:bg-muted">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-brand-gradient text-white" : "bg-muted text-foreground"
                }`}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {m.parts.map((p, i) =>
                      p.type === "text" ? <ReactMarkdown key={i}>{p.text}</ReactMarkdown> : null,
                    )}
                  </div>
                </div>
              </div>
            ))}
            {status === "streaming" && <div className="text-xs text-muted-foreground">Thinking…</div>}
          </div>
        )}
      </Card>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your career..." />
        <Button type="submit" className="bg-brand-gradient text-white border-0"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}