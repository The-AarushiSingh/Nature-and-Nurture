"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const filterGroups = [
  { key: "category", label: "Category", options: ["Immunity", "Stress Relief", "Digestion", "Culinary", "Skin Care", "Respiratory", "Sleep", "Cognitive", "Energy", "Hormonal", "Anti-inflammatory", "Blood Sugar"] },
  { key: "climate", label: "Climate", options: ["Tropical", "Subtropical", "Temperate", "Arid", "Mediterranean", "Alpine", "Arctic"] },
  { key: "sunlight", label: "Sunlight", options: ["Full Sun", "Partial Shade", "Low"] },
  { key: "water", label: "Water Needs", options: ["Low", "Moderate", "High"] },
  { key: "difficulty", label: "Difficulty", options: ["Easy", "Moderate", "Expert"] },
];

const sortOptions = [
  { key: "relevance", label: "Relevance" },
  { key: "az", label: "A-Z" },
  { key: "difficulty", label: "Difficulty" },
  { key: "recent", label: "Recently Added" },
];

const difficultyColor = { Easy: "bg-sage", Moderate: "bg-gold", Expert: "bg-clay" };

function slugify(name) {
  return name.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-");
}

export default function Explore() {
  const searchParams = useSearchParams();
  const { token, user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("relevance");
  const [savedIds, setSavedIds] = useState(new Set());

  const [filters, setFilters] = useState(() => {
    const initial = {};
    filterGroups.forEach((g) => (initial[g.key] = []));
    const cat = searchParams.get("category");
    if (cat) initial.category = [cat];
    return initial;
  });

  const toggleFilter = (groupKey, value) => {
    setFilters((prev) => {
      const current = prev[groupKey];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [groupKey]: updated };
    });
  };

  const clearAll = () => {
    const cleared = {};
    filterGroups.forEach((g) => (cleared[g.key] = []));
    setFilters(cleared);
    setSearch("");
  };

  const activeChips = filterGroups.flatMap((g) =>
    filters[g.key].map((v) => ({ group: g.key, value: v }))
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    filterGroups.forEach((g) => {
      if (filters[g.key].length > 0) params.append(g.key, filters[g.key].join(","));
    });
    if (sort !== "relevance") params.append("sort", sort);

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => { setPlants(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, filters, sort]);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSavedIds(new Set(data.map((p) => p._id))))
      .catch(() => {});
  }, [token]);

  const toggleSave = async (e, plantId) => {
    e.preventDefault();
    if (!user) { alert("Please log in to save plants."); return; }

    const isSaved = savedIds.has(plantId);
    const method = isSaved ? "DELETE" : "POST";

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden/${plantId}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    setSavedIds((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(plantId) : next.add(plantId);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Filters</h2>
            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-xs text-primary font-bold underline">Clear all</button>
            )}
          </div>

          {filterGroups.map((group) => (
            <div key={group.key} className="mb-6">
              <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.options.map((opt) => {
                  const active = filters[group.key].includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter(group.key, opt)}
                      className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 text-gray-600 hover:border-primary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search medicinal plants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-full px-5 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
            <div className="flex gap-2 flex-wrap">
              {sortOptions.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`text-xs font-bold px-3 py-2 rounded-full border-2 transition-colors ${
                    sort === s.key ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-muted">
              <span className="font-bold text-primary">{plants.length}</span> plants found
            </p>
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeChips.map((chip) => (
                  <button
                    key={`${chip.group}-${chip.value}`}
                    onClick={() => toggleFilter(chip.group, chip.value)}
                    className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    {chip.value} <span className="font-bold">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <p className="text-muted">Loading plants...</p>
          ) : plants.length === 0 ? (
            <div className="bg-white border-2 border-primary/10 rounded-2xl p-12 text-center text-muted">
              No plants match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {plants.map((p) => {
                const imagePath = `/images/plants/${slugify(p.commonName)}.jpg`;
                const diffColor = difficultyColor[p.careGuide?.difficulty] || "bg-gray-300";
                const isSaved = savedIds.has(p._id);

                return (
                  <Link
                    key={p._id}
                    href={`/plants/${p._id}`}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="h-32 bg-sage/20 relative overflow-hidden">
                      <img
                        src={imagePath}
                        alt={p.commonName}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <button
                        onClick={(e) => toggleSave(e, p._id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm"
                      >
                        {isSaved ? "❤️" : "🤍"}
                      </button>
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-white/90 px-2 py-0.5 rounded-full">
                        <span className={`w-1.5 h-1.5 rounded-full ${diffColor}`} />
                        {p.careGuide?.difficulty}
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="font-bold text-gray-900 text-sm leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                        {p.commonName}
                      </p>
                      {p.hindiName && <p className="text-primary text-xs font-medium mt-0.5">{p.hindiName}</p>}
                      <p className="italic text-muted text-xs mt-0.5">{p.botanicalName}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}