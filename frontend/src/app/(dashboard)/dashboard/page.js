"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setSavedCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setSavedCount(0));
    }
  }, [token]);

  if (loading || !user) return <p className="p-10 text-muted">Loading...</p>;

  const stats = [
    { label: "Plants Saved", value: savedCount, icon: "🌿" },
    { label: "AI Queries", value: "—", icon: "🤖", note: "Coming soon" },
    { label: "Plants ID'd", value: "—", icon: "📷", note: "Coming soon" },
    { label: "Streak", value: "—", icon: "🔥", note: "Coming soon" },
  ];

  const quickActions = [
    { label: "AI Assistant", sub: "Ask anything", icon: "🤖", href: "/assistant" },
    { label: "Recommendations", sub: "Personalized picks", icon: "✨", href: "/recommendations" },
    { label: "Identify Plant", sub: "Upload a photo", icon: "📷", href: "/plant-id" },
    { label: "Diagnose", sub: "Disease check", icon: "🩺", href: "/diagnosis" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <p className="text-sm text-muted">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Good day, {user.name.split(" ")[0]} 🌿
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-2xl p-5"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-muted">{s.label}</p>
              <span>{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            {s.note && <p className="text-xs text-muted mt-1">{s.note}</p>}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <p className="font-medium text-gray-900 text-sm">{a.label}</p>
            <p className="text-xs text-muted">{a.sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-muted text-sm">
          More sections (Recently Viewed, Recent Activity, Continue with AI)
          will appear here as those features get built.
        </p>
      </div>
    </main>
  );
}