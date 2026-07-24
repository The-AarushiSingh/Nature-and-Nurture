"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants`)
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="p-10 text-muted">Loading plants...</p>;

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Medicinal Plants
        </h1>
        <p className="text-muted mb-8">
          Curated plants from our AI-verified database
        </p>

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
      </div>
    </main>
  );
}