"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const activityIcons = {
  viewed_plant: { icon: "👁️", color: "bg-primary" },
  asked_ai: { icon: "🤖", color: "bg-gold" },
  saved_garden: { icon: "💚", color: "bg-sage" },
  identified_plant: { icon: "📷", color: "bg-clay" },
  diagnosed_plant: { icon: "🩺", color: "bg-berry" },
  recommendation_quiz: { icon: "✨", color: "bg-primary" },
};

const careTips = [
  "Ashwagandha prefers dry soil between waterings — overwatering is the most common way people kill it.",
  "Tulsi grows fastest with at least 6 hours of direct sun a day, even indoors near a bright window.",
  "Curry leaf plants are slow starters — don't judge growth speed until month 3-4.",
  "Neem is naturally pest-resistant, making it one of the lowest-maintenance plants to start with.",
  "Mint spreads aggressively — always grow it in its own container, never mixed with other plants.",
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [savedPlants, setSavedPlants] = useState([]);
  const [stats, setStats] = useState({
    aiQueries: 0,
    plantsIdd: 0,
    activeDays: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [lastChat, setLastChat] = useState(null);
  const [tip] = useState(careTips[Math.floor(Math.random() * careTips.length)]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden`, { headers })
      .then((r) => r.json())
      .then((d) => setSavedPlants(Array.isArray(d) ? d : []));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity/stats`, { headers })
      .then((r) => r.json())
      .then(setStats);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity/recent`, { headers })
      .then((r) => r.json())
      .then((d) => {
        setRecentActivity(Array.isArray(d) ? d : []);
        const chat = d?.find((a) => a.type === "asked_ai");
        if (chat) setLastChat(chat);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity/recently-viewed`, {
      headers,
    })
      .then((r) => r.json())
      .then((d) => setRecentlyViewed(Array.isArray(d) ? d : []));
  }, [token]);

  if (loading || !user) return <p className="p-10 text-muted">Loading...</p>;

  const statCards = [
    {
      label: "Plants Saved",
      value: savedPlants.length,
      icon: "🌿",
      bg: "bg-primary",
    },
    { label: "AI Queries", value: stats.aiQueries, icon: "🤖", bg: "bg-gold" },
    { label: "Plants ID'd", value: stats.plantsIdd, icon: "📷", bg: "bg-sage" },
    {
      label: "Active Days",
      value: stats.activeDays,
      icon: "🔥",
      bg: "bg-clay",
    },
  ];

  const quickActions = [
    {
      label: "AI Assistant",
      sub: "Ask anything",
      icon: "🤖",
      href: "/assistant",
      bg: "bg-primary",
    },
    {
      label: "Recommendations",
      sub: "Personalized picks",
      icon: "✨",
      href: "/recommendations",
      bg: "bg-gold",
    },
    {
      label: "Identify Plant",
      sub: "Upload a photo",
      icon: "📷",
      href: "/plant-id",
      bg: "bg-sage",
    },
    {
      label: "Diagnose",
      sub: "Disease check",
      icon: "🩺",
      href: "/diagnosis",
      bg: "bg-clay",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p
            className="
  inline-flex items-center gap-2
  text-xs font-semibold
  uppercase tracking-widest
  text-primary
  bg-primary/10
  px-4 py-2
  rounded-full
  mb-3
"
          >
            🌿{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>

          <h1
            className="
    text-4xl font-bold
    bg-gradient-to-r
    from-primary
    via-sage
    to-gold
    bg-clip-text
    text-transparent
  "
            style={{ fontFamily: "var(--font-display)" }}
          >
            {new Date().getHours() < 12
              ? "Fresh morning,"
              : new Date().getHours() < 18
                ? "Growing afternoon,"
                : "Peaceful evening,"}{" "}
            {user.name.split(" ")[0]} 🌱
          </h1>
          <p
            className="
  mt-2
  text-sm
  text-muted
  flex items-center gap-2
"
          >
            <span
              className="
    w-2 h-2 rounded-full
    bg-sage
    animate-pulse
  "
            />
            Your garden is waiting for today's discovery.
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold rotate-3">
          {user.name[0]}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className={`${s.bg} ${i % 2 === 0 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition-transform duration-300 rounded-2xl p-5 shadow-lg border-4 border-white`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-white/70 font-semibold">{s.label}</p>
              <span>{s.icon}</span>
            </div>
            <p
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2
              className="text-lg font-bold text-primary mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="bg-white border-2 border-primary/10 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-xl ${a.bg} flex items-center justify-center text-lg mb-2 rotate-3 text-white`}
                  >
                    {a.icon}
                  </div>
                  <p className="font-bold text-primary text-xs">{a.label}</p>
                  <p className="text-[10px] text-muted">{a.sub}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-primary/10 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="font-bold text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Recently Viewed
              </h3>
              <Link href="/explore" className="text-xs text-primary font-bold">
                See all →
              </Link>
            </div>
            {recentlyViewed.length === 0 ? (
              <p className="text-sm text-muted">
                Nothing viewed yet — go explore some plants.
              </p>
            ) : (
              <div className="space-y-2">
                {recentlyViewed.map(({ plant, viewedAt }) => (
                  <Link
                    key={plant._id}
                    href={`/plants/${plant._id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {plant.commonName}
                      </p>
                      <p className="italic text-xs text-muted">
                        {plant.botanicalName}
                      </p>
                    </div>
                    <span className="text-xs text-muted">
                      {timeAgo(viewedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {lastChat && (
            <div className="bg-white border-2 border-primary/10 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h3
                  className="font-bold text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Continue with AI
                </h3>
                <Link
                  href="/assistant"
                  className="text-xs text-primary font-bold"
                >
                  + New Chat
                </Link>
              </div>
              <p className="text-xs text-muted mb-1">
                {timeAgo(lastChat.createdAt)}
              </p>
              <p className="font-semibold text-sm text-gray-900 mb-1">
                {lastChat.title}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {lastChat.subtitle}
              </p>
              <Link
                href="/assistant"
                className="text-xs text-primary font-bold"
              >
                Continue this conversation →
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border-2 border-primary/10 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="font-bold text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                My Garden
              </h3>
              <Link href="/garden" className="text-xs text-primary font-bold">
                View all ({savedPlants.length}) →
              </Link>
            </div>
            {savedPlants.length === 0 ? (
              <p className="text-sm text-muted">No plants saved yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedPlants.slice(0, 6).map((p) => (
                  <Link
                    key={p._id}
                    href={`/plants/${p._id}`}
                    className="bg-sage/25 rounded-xl p-2 text-center hover:bg-sage/40 transition-colors"
                  >
                    <p className="text-[10px] font-bold text-primary truncate">
                      {p.commonName}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-primary/10 rounded-2xl p-5">
            <h3
              className="font-bold text-primary mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 6).map((a) => {
                  const meta = activityIcons[a.type] || {
                    icon: "•",
                    color: "bg-primary",
                  };
                  return (
                    <div key={a._id} className="flex gap-3 items-start">
                      <span
                        className={`w-2 h-2 rounded-full ${meta.color} mt-1.5 shrink-0`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-900 leading-tight">
                          {a.title}
                        </p>
                        <p className="text-[10px] text-muted">
                          {timeAgo(a.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-primary rounded-2xl p-5 rotate-1">
            <p className="text-sage text-xs font-bold uppercase tracking-wide mb-2">
              💡 Tip of the Day
            </p>
            <p className="text-white text-sm leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
