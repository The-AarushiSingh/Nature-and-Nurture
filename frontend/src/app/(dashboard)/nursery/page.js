"use client";
import { useState } from "react";

export default function NurseryPage() {
  const [nurseries, setNurseries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const findNearby = () => {
    setError("");
    setLoading(true);
    setSearched(true);

    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nursery?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          setNurseries(Array.isArray(data) ? data : []);
        } catch {
          setError("Could not fetch nearby nurseries.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please enable location permissions to find nurseries near you.");
        setLoading(false);
      }
    );
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
        Get Growing
      </span>
      <h1 className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Nursery Locator
      </h1>
      <p className="text-muted mb-8">
        Find real garden centres and nurseries near you, sourced from OpenStreetMap.
      </p>

      {!searched && (
        <div className="bg-white border-2 border-dashed border-primary/20 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">📍</p>
          <p className="text-muted mb-4">We'll use your location to find nurseries within 15km.</p>
          <button onClick={findNearby} className="bg-primary text-white rounded-full px-6 py-3 font-bold hover:bg-primary-light transition-colors">
            Find Nurseries Near Me
          </button>
        </div>
      )}

      {loading && <p className="text-muted text-center py-8">Finding nurseries near you...</p>}
      {error && <p className="text-clay text-sm bg-clay/10 rounded-xl p-4">{error}</p>}

      {!loading && searched && !error && (
        nurseries.length === 0 ? (
          <p className="text-muted text-center py-8">No nurseries found nearby. Try a different location, or check back — OpenStreetMap coverage varies by area.</p>
        ) : (
          <div className="space-y-3">
  {nurseries.map((n) => (
    <a
      key={n.id}
      href={`https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-900">
            {n.name || "Unnamed Nursery"}
          </p>

          <p className="text-xs text-primary font-medium capitalize">
            {n.type}
          </p>

          {n.address && (
            <p className="text-xs text-muted mt-1">
              {n.address}
            </p>
          )}
        </div>

        <span className="text-xs text-primary font-bold">
          Directions →
        </span>
      </div>
    </a>
  ))}
</div>

        )
      )}
    </main>
  );
}