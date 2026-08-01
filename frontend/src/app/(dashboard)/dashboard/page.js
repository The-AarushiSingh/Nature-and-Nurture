"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const careTips = [
  "Ashwagandha prefers dry soil between waterings — overwatering is the most common way people kill it.",
  "Tulsi grows fastest with at least 6 hours of direct sun a day, even indoors near a bright window.",
  "Curry leaf plants are slow starters — don't judge growth speed until month 3-4.",
  "Neem is naturally pest-resistant, making it one of the lowest-maintenance plants to start with.",
  "Mint spreads aggressively — always grow it in its own container, never mixed with other plants.",
];

export default function Dashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [savedPlants, setSavedPlants] = useState([]);
  const [tip] = useState(careTips[Math.floor(Math.random() * careTips.length)]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setSavedPlants(Array.isArray(data) ? data : []))
        .catch(() => setSavedPlants([]));
    }
  }, [token]);

  if (loading || !user) return <p className="p-10 text-muted">Loading...</p>;

  const quickActions = [
    { label: "AI Assistant", sub: "Ask anything", icon: "🤖", href: "/assistant" },
    { label: "Recommendations", sub: "Personalized picks", icon: "✨", href: "/recommendations" },
    { label: "Identify Plant", sub: "Upload a photo", icon: "📷", href: "/plant-id" },
    { label: "Diagnose", sub: "Disease check", icon: "🩺", href: "/diagnosis" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <p className="text-sm text-muted">
        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Good day, {user.name.split(" ")[0]} 🌿
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-sm text-muted">Plants Saved</p>
            <p className="text-3xl font-bold text-primary">{savedPlants.length}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">My Garden</h3>
              <Link href="/garden" className="text-xs text-primary font-medium">View all →</Link>
            </div>
            {savedPlants.length === 0 ? (
              <p className="text-sm text-muted">No plants saved yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedPlants.slice(0, 6).map((p) => (
                  <Link
                    key={p._id}
                    href={`/plants/${p._id}`}
                    className="bg-primary/10 rounded-lg p-2 text-center hover:bg-primary/20 transition-colors"
                  >
                    <p className="text-[10px] font-semibold text-primary truncate">{p.commonName}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-primary rounded-2xl p-5">
            <p className="text-sage text-xs font-bold uppercase tracking-wide mb-2">💡 Tip of the Day</p>
            <p className="text-white text-sm leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>
    </main>
  );
}