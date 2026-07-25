"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GardenPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [fetching, setFetching] = useState(true);

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
        .then((data) => {
          setPlants(Array.isArray(data) ? data : []);
          setFetching(false);
        })
        .catch(() => setFetching(false));
    }
  }, [token]);

  const handleRemove = async (plantId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden/${plantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlants((prev) => prev.filter((p) => p._id !== plantId));
    } catch (err) {
      alert("Could not remove plant");
    }
  };

  if (loading || !user) return <p className="p-10 text-muted">Loading...</p>;

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Garden</h1>
      <p className="text-muted mb-8">
        Plants you've saved for future reference and care tracking.
      </p>

      {fetching ? (
        <p className="text-muted">Loading your garden...</p>
      ) : plants.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-muted mb-4">
            You haven't saved any plants yet.
          </p>
          <Link
            href="/"
            className="text-primary font-medium underline"
          >
            Explore plants to get started →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {plants.map((plant) => (
            <div
              key={plant._id}
              className="bg-white border border-gray-200 rounded-2xl p-4 relative"
            >
              <button
                onClick={() => handleRemove(plant._id)}
                className="absolute top-3 right-3 text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
              <Link href={`/plants/${plant._id}`}>
                <h2 className="text-lg font-semibold text-gray-900 pr-14">
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}