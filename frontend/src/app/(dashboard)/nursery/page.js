"use client";
import { useState } from "react";

const quickSearches = [
  { label: "Plant Nurseries", query: "plant nursery" },
  { label: "Garden Centres", query: "garden centre" },
  { label: "Ayurvedic Plant Sellers", query: "ayurvedic plants nursery" },
  { label: "Florists", query: "florist plants" },
];

export default function NurseryPage() {
  const [mode, setMode] = useState(null); // "location" | "manual"
  const [manualCity, setManualCity] = useState("");
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const useMyLocation = () => {
    setError("");
    setLocating(true);
    if (!navigator.geolocation) {
      setError(
        "Your browser doesn't support location access — try entering your city instead.",
      );
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMode("location");
        setLocating(false);
      },
      () => {
        setError(
          "Location access denied — no problem, just type your city below instead.",
        );
        setLocating(false);
        setMode("manual");
      },
    );
  };

  const buildMapsUrl = (query) => {
    if (mode === "location" && coords) {
      return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},13z`;
    }
    if (mode === "manual" && manualCity.trim()) {
      return `https://www.google.com/maps/search/${encodeURIComponent(query + " in " + manualCity)}`;
    }
    return null;
  };

  const ready =
    (mode === "location" && coords) ||
    (mode === "manual" && manualCity.trim().length > 2);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
        Get Growing
      </span>
      <h1
        className="text-3xl font-bold text-primary mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Nursery Locator
      </h1>
      <p className="text-muted mb-8">
        Find real, up-to-date nurseries near you — powered by Google Maps
        directly.
      </p>

      {!mode && (
        <div className="bg-primary rounded-3xl p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4 rotate-3">
            📍
          </div>
          <p
            className="text-white font-bold mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How should we find nurseries?
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={useMyLocation}
              disabled={locating}
              className="bg-gold text-white rounded-full px-6 py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {locating ? "Locating..." : "📍 Use My Location"}
            </button>
            <button
              onClick={() => setMode("manual")}
              className="bg-white/15 text-white rounded-full px-6 py-3 font-bold hover:bg-white/25 transition-colors"
            >
              ✏️ Type My City
            </button>
          </div>
          {error && <p className="text-white/80 text-xs mt-4">{error}</p>}
        </div>
      )}

      {mode === "manual" && (
        <div className="bg-white border-2 border-primary/10 rounded-2xl p-6 mb-6">
          <label className="text-sm font-bold text-primary mb-2 block">
            Your city or area
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2">📍</span>

            <input
              type="text"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="Search your city or area..."
              className="
      w-full
      bg-cream
      border-2 border-primary/10
      rounded-full
      pl-12 pr-5 py-3
      text-sm
      text-primary
      font-medium
      outline-none
      focus:border-primary
      transition-all
    "
            />
          </div>
        </div>
      )}

      {mode === "location" && coords && (
        <div className="bg-sage/20 border border-sage/40 rounded-2xl p-4 mb-6 text-sm text-primary font-medium">
          ✓ Using your current location
        </div>
      )}

      {mode && (
        <div>
          <div className="mb-5">
            <p className="text-lg font-bold text-primary">
              {ready ? "What are you looking for? 🌱" : "Almost there"}
            </p>

            <p className="text-sm text-muted mt-1">
              {ready
                ? "Pick a category and discover nearby places."
                : "Enter your location to unlock searches."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickSearches.map((q) => {
              const url = buildMapsUrl(q.query);

              return (
                <a
                  key={q.label}
                  href={url || "#"}
                  target={url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => !url && e.preventDefault()}
                  className={`bg-white border-2 rounded-2xl p-5 flex items-center justify-between ${
                    url
                      ? "border-primary/10 hover:shadow-lg hover:-translate-y-1"
                      : "border-gray-100 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{q.label}</p>

                    <p className="text-xs text-muted mt-1">
                      Discover nearby options →
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                    →
                  </div>
                </a>
              );
            })}
          </div>

          <button
            onClick={() => {
              setMode(null);
              setCoords(null);
              setManualCity("");
            }}
            className="text-xs text-muted underline mt-6"
          >
            ← Start over
          </button>
        </div>
      )}
    </main>
  );
}
