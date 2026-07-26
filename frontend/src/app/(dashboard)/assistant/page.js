"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assistant/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.text }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Sorry, something went wrong.", sources: [] },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.answer, sources: data.sources },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Could not connect to server.", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Best herbs for anxiety & stress?",
    "Easy medicinal plants for beginners",
    "Top immunity-boosting herbs",
    "Which plants help with digestion?",
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nature AI</h1>
        <p className="text-muted text-sm mb-6">
          Ask me anything about medicinal plants — grounded in our database, not guesses.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-left text-sm bg-white border border-gray-200 rounded-xl p-3 hover:border-primary/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                  {msg.sources.map((s) => (
                    <Link
                      key={s.id}
                      href={`/plants/${s.id}`}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                    >
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
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-muted">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any medicinal plant, cultivation advice, health benefits..."
          className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-full px-5 py-2.5 font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}