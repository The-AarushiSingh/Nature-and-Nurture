"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PlantProfile() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlant(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="p-10 text-muted">Loading plant...</p>;
  if (!plant)
    return <p className="p-10 text-muted">Plant not found.</p>;

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="text-sm text-primary hover:underline mb-6 inline-block">
          ← Back to all plants
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">{plant.commonName}</h1>
        <p className="italic text-muted mb-4">{plant.botanicalName}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {plant.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-2xl p-5 mb-8">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Family</p>
            <p className="font-medium text-gray-900">{plant.family}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Origin</p>
            <p className="font-medium text-gray-900">{plant.origin}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Difficulty</p>
            <p className="font-medium text-gray-900">{plant.careGuide?.difficulty}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Growth Rate</p>
            <p className="font-medium text-gray-900">{plant.careGuide?.growthRate}</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
          <p className="text-gray-700 leading-relaxed">{plant.description}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Care Guide</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p>☀️ <span className="text-muted">Sunlight:</span> {plant.careGuide?.sunlight}</p>
            <p>💧 <span className="text-muted">Water:</span> {plant.careGuide?.water}</p>
            <p>🌱 <span className="text-muted">Soil:</span> {plant.careGuide?.soil}</p>
            <p>⏱️ <span className="text-muted">Harvest Time:</span> {plant.careGuide?.harvestTime}</p>
            <p>🌍 <span className="text-muted">Climate:</span> {plant.careGuide?.climate?.join(", ")}</p>
            <p>🪴 <span className="text-muted">Part Used:</span> {plant.careGuide?.partUsed}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Medicinal Uses</h2>
          <ul className="space-y-1.5">
            {plant.medicinalUses?.map((use) => (
              <li key={use} className="text-gray-700 text-sm">✔️ {use}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Active Compounds</h2>
          <p className="text-gray-700 text-sm">{plant.activeCompounds?.join(", ")}</p>
        </section>

        {plant.precautions && (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">⚠️ Precautions:</span> {plant.precautions}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}