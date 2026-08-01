"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

const tabs = ["Overview", "Medicinal Uses", "Care Guide", "Compounds", "Safety"];

const levelMaps = {
  sunlight: { "Low": 1, "Partial Shade": 2, "Full Sun to Partial Shade": 2, "Full Sun": 3 },
  water: { "Low": 1, "Moderate": 2, "Moderate to High": 2, "High": 3 },
  difficulty: { "Easy": 1, "Moderate": 2, "Expert": 3 },
};

function levelBar(value, mapKey) {
  const level = levelMaps[mapKey]?.[value] || 1;
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`w-5 h-1.5 rounded-full ${i <= level ? "bg-primary" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

export default function PlantProfile() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [plant, setPlant] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlant(data);
        setLoading(false);
        if (token) {
          logActivity(token, { type: "viewed_plant", title: `Viewed ${data.commonName}`, relatedPlantId: data._id });
        }
      })
      .catch(() => setLoading(false));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants/${id}/similar`)
      .then((res) => res.json())
      .then(setSimilar)
      .catch(() => setSimilar([]));
  }, [id]);

  const handleSaveToGarden = async () => {
    if (!user) { alert("Please log in to save plants to your garden."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        logActivity(token, { type: "saved_garden", title: `Saved ${plant.commonName} to garden` });
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Could not connect to server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10 text-muted">Loading plant...</p>;
  if (!plant) return <p className="p-10 text-muted">Plant not found.</p>;

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-muted mb-4">
          <Link href="/explore" className="hover:text-primary">Explore Plants</Link>
          <span className="mx-1.5">/</span>
          <span>{plant.category}</span>
          <span className="mx-1.5">/</span>
          <span className="text-primary font-medium">{plant.commonName}</span>
        </div>

        {/* Hero banner */}
        <div className="relative h-64 rounded-3xl overflow-hidden mb-6 bg-primary">
          <img
            src={`/images/plants/${plant.commonName.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-")}.jpg`}
            alt={plant.commonName}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <div className="flex gap-2 mb-3">
                {plant.tags?.map((tag) => (
                  <span key={tag} className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-white drop-shadow" style={{ fontFamily: "var(--font-display)" }}>
                {plant.commonName}
                {plant.hindiName && <span className="text-2xl font-normal text-white/80"> · {plant.hindiName}</span>}
              </h1>
              <p className="italic text-white/80 mt-1">{plant.botanicalName}</p>
            </div>
            <button
              onClick={handleSaveToGarden}
              disabled={saved || saving}
              className={`px-5 py-2.5 rounded-full text-sm font-bold shrink-0 transition-colors ${
                saved ? "bg-white/20 text-white cursor-not-allowed" : "bg-gold text-white hover:opacity-90"
              }`}
            >
              {saved ? "✓ Saved" : saving ? "Saving..." : "+ Save to Garden"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Quick stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-gray-200 rounded-2xl p-5 mb-6">
              <div>
                <p className="text-xs text-muted">Family</p>
                <p className="font-bold text-gray-900 text-sm">{plant.family || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Origin</p>
                <p className="font-bold text-gray-900 text-sm">{plant.origin || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Difficulty</p>
                <p className="font-bold text-gray-900 text-sm">{plant.careGuide?.difficulty || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Growth Rate</p>
                <p className="font-bold text-gray-900 text-sm">{plant.careGuide?.growthRate || "—"}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[200px]">
              {activeTab === "Overview" && (
                <div>
                  <h3 className="font-bold text-primary mb-2">About {plant.commonName}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{plant.description}</p>
                </div>
              )}
              {activeTab === "Medicinal Uses" && (
                <ul className="space-y-2">
                  {plant.medicinalUses?.map((use) => (
                    <li key={use} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-sage mt-0.5">✓</span> {use}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "Care Guide" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <p>☀️ <span className="text-muted">Sunlight:</span> <span className="font-medium">{plant.careGuide?.sunlight}</span></p>
                  <p>💧 <span className="text-muted">Water:</span> <span className="font-medium">{plant.careGuide?.water}</span></p>
                  <p>🌱 <span className="text-muted">Soil:</span> <span className="font-medium">{plant.careGuide?.soil}</span></p>
                  <p>🌍 <span className="text-muted">Climate:</span> <span className="font-medium">{plant.careGuide?.climate?.join(", ")}</span></p>
                  <p>⏱️ <span className="text-muted">Harvest Time:</span> <span className="font-medium">{plant.careGuide?.harvestTime}</span></p>
                  <p>🪴 <span className="text-muted">Part Used:</span> <span className="font-medium">{plant.careGuide?.partUsed}</span></p>
                </div>
              )}
              {activeTab === "Compounds" && (
                <div className="flex flex-wrap gap-2">
                  {plant.activeCompounds?.map((c) => (
                    <span key={c} className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              )}
              {activeTab === "Safety" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-900">
                    <span className="font-bold">⚠️ Precautions:</span> {plant.precautions || "No specific precautions noted — always consult a professional before medicinal use."}
                  </p>
                </div>
              )}
            </div>

            {/* Real AI CTA instead of fabricated summary */}
            <div className="bg-primary rounded-2xl p-5 mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sage text-xs font-bold uppercase tracking-wide mb-1">Have a question?</p>
                <p className="text-white text-sm">Ask our AI Assistant anything about {plant.commonName}, grounded in real data.</p>
              </div>
              <Link
                href={`/assistant?q=${encodeURIComponent(`Tell me more about ${plant.commonName}`)}`}
                className="bg-white text-primary px-5 py-2.5 rounded-full text-sm font-bold shrink-0 hover:scale-105 transition-transform"
              >
                Ask AI →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Link
              href="/compare"
              className="block bg-white border-2 border-primary/20 rounded-2xl p-4 text-center font-bold text-primary text-sm hover:bg-primary/5 transition-colors"
            >
              📊 Compare with other plants
            </Link>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-primary mb-4" style={{ fontFamily: "var(--font-display)" }}>Care at a Glance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">☀️ Sunlight</span>
                  {levelBar(plant.careGuide?.sunlight, "sunlight")}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">💧 Water</span>
                  {levelBar(plant.careGuide?.water, "water")}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">🌱 Difficulty</span>
                  {levelBar(plant.careGuide?.difficulty, "difficulty")}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-primary mb-4" style={{ fontFamily: "var(--font-display)" }}>Quick Facts</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-muted">Harvest time</span><span className="font-medium text-gray-900">{plant.careGuide?.harvestTime || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Part used</span><span className="font-medium text-gray-900">{plant.careGuide?.partUsed || "—"}</span></div>
                {plant.sanskritName && <div className="flex justify-between"><span className="text-muted">Sanskrit name</span><span className="font-medium italic text-gray-900">{plant.sanskritName}</span></div>}
                {plant.studiesCited > 0 && <div className="flex justify-between"><span className="text-muted">Studies referenced</span><span className="font-medium text-gray-900">{plant.studiesCited}</span></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Plants — real, via embeddings */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-primary mb-4" style={{ fontFamily: "var(--font-display)" }}>Similar Plants</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((p) => (
                <Link
                  key={p._id}
                  href={`/plants/${p._id}`}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <p className="font-bold text-gray-900 text-sm">{p.commonName}</p>
                  <p className="italic text-xs text-muted">{p.botanicalName}</p>
                  <span className="inline-block text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-2">
                    {p.category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}