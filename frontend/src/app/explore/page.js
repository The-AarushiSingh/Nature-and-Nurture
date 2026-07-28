"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (difficulty) params.append("difficulty", difficulty);
    if (category) params.append("category", category);

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [search, difficulty, category]);

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Medicinal Plants
        </h1>
        <p className="text-muted mb-6">
          Curated plants from our AI-verified database
        </p>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search medicinal plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 border border-gray-300 rounded-full px-5 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Expert">Expert</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white"
          >
            <option value="">All Categories</option>
            <option value="Immunity">Immunity</option>
            <option value="Stress Relief">Stress Relief</option>
            <option value="Digestion">Digestion</option>
            <option value="Energy">Energy</option>
            <option value="Sleep">Sleep</option>
            <option value="Skin Care">Skin Care</option>
            <option value="Anti-inflammatory">Anti-inflammatory</option>
            <option value="Respiratory">Respiratory</option>
            <option value="Cognitive">Cognitive</option>
            <option value="Hormonal">Hormonal</option>
          </select>

          {(search || difficulty || category) && (
            <button
              onClick={() => {
                setSearch("");
                setDifficulty("");
                setCategory("");
              }}
              className="text-sm text-primary underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-muted">Loading plants...</p>
        ) : plants.length === 0 ? (
          <p className="text-muted">No plants match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {plants.map((plant) => (
              <Link
                key={plant._id}
                href={`/plants/${plant._id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {plant.commonName}
                </h2>
                <p className="italic text-sm text-muted mb-3">
                  {plant.botanicalName}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {plant.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}