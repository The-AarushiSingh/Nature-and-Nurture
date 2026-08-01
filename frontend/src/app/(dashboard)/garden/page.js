"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function slugify(name) {
  return name.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-");
}

export default function GardenPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => { setPlants(Array.isArray(data) ? data : []); setFetching(false); })
        .catch(() => setFetching(false));
    }
  }, [token]);

  const handleRemove = async (e, plantId) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden/${plantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlants((prev) => prev.filter((p) => p._id !== plantId));
    } catch {
      alert("Could not remove plant");
    }
  };

  if (loading || !user) return <p className="p-10 text-muted">Loading...</p>;

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
        Your Collection
      </span>
      <h1 className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: "var(--font-display)" }}>
        My Garden
      </h1>
      <p className="text-muted mb-8">
        {plants.length} plant{plants.length !== 1 ? "s" : ""} saved for future reference and care tracking.
      </p>

      {fetching ? (
        <p className="text-muted">Loading your garden...</p>
      ) : plants.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-primary/20 rounded-2xl p-16 text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-muted mb-4">You haven't saved any plants yet.</p>
          <Link href="/explore" className="inline-block bg-primary text-white rounded-full px-6 py-2.5 font-bold hover:bg-primary-light transition-colors">
            Explore Plants →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {plants.map((plant) => {
            const imagePath = `/images/plants/${slugify(plant.commonName)}.jpg`;
            return (
              <Link
                key={plant._id}
                href={`/plants/${plant._id}`}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative group"
              >
                <div className="h-28 bg-sage/20 relative overflow-hidden">
                  <img
                    src={imagePath}
                    alt={plant.commonName}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <button
                    onClick={(e) => handleRemove(e, plant._id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from garden"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-3.5">
                  <p className="font-bold text-gray-900 text-sm leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {plant.commonName}
                  </p>
                  {plant.hindiName && <p className="text-primary text-xs font-medium mt-0.5">{plant.hindiName}</p>}
                  <p className="italic text-muted text-xs mt-0.5">{plant.botanicalName}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}