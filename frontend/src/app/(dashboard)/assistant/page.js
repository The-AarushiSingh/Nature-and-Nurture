"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

const suggestions = [
  { icon: "🧘", text: "Best herbs for anxiety & stress?" },
  { icon: "🌱", text: "Easy medicinal plants for beginners" },
  { icon: "🛡️", text: "Top immunity-boosting herbs" },
  { icon: "🍳", text: "What can I use to garnish my food?" },
];

export default function AssistantPage() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSources, setLastSources] = useState([]);
  const bottomRef = useRef(null);
  const prefilled = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !prefilled.current) {
      prefilled.current = true;
      setInput(q);
    }
  }, [searchParams]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong.", sources: [] }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: data.answer, sources: data.sources }]);
        setLastSources(data.sources || []);
        if (token) {
          logActivity(token, { type: "asked_ai", title: text, subtitle: data.answer?.slice(0, 80) });
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Could not connect to server.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setLastSources([]);
    setInput("");
  };

  return (
    <div className="flex h-screen">
      {/* Chat column */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Nature AI</h1>
            <p className="text-xs text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              Grounded in our 35-plant database — not general internet knowledge
            </p>
          </div>
          <button
            onClick={handleNewChat}
            className="text-xs font-bold text-primary border-2 border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 && (
            <div className="mt-8">
              <p className="text-center text-muted text-sm mb-6">Ask me anything about our medicinal & culinary plants</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => sendMessage(s.text)}
                    className="text-left text-sm bg-white border-2 border-primary/10 rounded-xl p-3.5 hover:border-primary/40 hover:shadow-md transition-all flex items-center gap-2.5"
                  >
                    <span>{s.icon}</span> {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                  msg.role === "user" ? "bg-primary text-white" : "bg-white border-2 border-primary/10 text-gray-800"
                }`}
              >
                {msg.text}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {msg.sources.map((s) => (
                      <Link key={s.id} href={`/plants/${s.id}`} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-primary/10 rounded-2xl px-4 py-3 text-sm text-muted">
                Searching our plant database...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any medicinal plant, cultivation advice, health benefits..."
            className="flex-1 border-2 border-primary/20 rounded-full px-5 py-2.5 focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded-full px-5 py-2.5 font-bold hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
        <p className="text-[10px] text-muted text-center mt-2">
          Educational information only — not a substitute for professional medical advice.
        </p>
      </div>

      {/* Retrieved plants panel — real data, not fabricated citations */}
      <div className="w-80 border-l border-gray-200 bg-white p-6 hidden lg:block overflow-y-auto">
        <h2 className="font-bold text-primary text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Retrieved Plants
        </h2>
        <p className="text-xs text-muted mb-4">
          Plants matched to your last question via semantic search on our real database.
        </p>

        {lastSources.length === 0 ? (
          <p className="text-sm text-muted">Ask a question to see which plants the AI retrieved.</p>
        ) : (
          <div className="space-y-3">
            {lastSources.map((s) => (
              <Link
                key={s.id}
                href={`/plants/${s.id}`}
                className="block bg-cream border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all"
              >
                <p className="font-bold text-primary text-sm">{s.name}</p>
                <p className="text-xs text-muted">Similarity score: {s.score}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 bg-primary/5 border border-primary/10 rounded-xl p-4">
          <p className="text-xs text-primary font-bold mb-1">How this works</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your question is converted to a vector and compared against every
            plant in our database using cosine similarity. The top matches are
            fed to the AI so its answer is grounded in real, verifiable data.
          </p>
        </div>
      </div>
    </div>
  );
}