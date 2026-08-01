"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function slugify(name) {
  return name.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-");
}

export default function ComparePage() {
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants`)
      .then((res) => res.json())
      .then(setAllPlants)
      .catch(() => {});
  }, []);

  const handleAddPlant = (plantId) => {
    if (!plantId) return;
    if (selectedPlants.length >= 4) {
      alert("You can compare up to 4 plants at a time.");
      return;
    }
    const plant = allPlants.find((p) => p._id === plantId);
    if (plant) setSelectedPlants([...selectedPlants, plant]);
    setDropdownValue("");
  };

  const handleRemovePlant = (plantId) => {
    setSelectedPlants(selectedPlants.filter((p) => p._id !== plantId));
  };

  const availableOptions = allPlants.filter(
    (p) => !selectedPlants.some((sp) => sp._id === p._id),
  );

  const rows = [
    { label: "Category", getValue: (p) => p.category },
    { label: "Difficulty", getValue: (p) => p.careGuide?.difficulty },
    { label: "Sunlight", getValue: (p) => p.careGuide?.sunlight },
    { label: "Water Needs", getValue: (p) => p.careGuide?.water },
    { label: "Soil Type", getValue: (p) => p.careGuide?.soil },
    { label: "Climate", getValue: (p) => p.careGuide?.climate?.join(", ") },
    { label: "Growth Rate", getValue: (p) => p.careGuide?.growthRate },
    { label: "Harvest Time", getValue: (p) => p.careGuide?.harvestTime },
    {
      label: "Active Compounds",
      getValue: (p) => p.activeCompounds?.join(", "),
    },
    { label: "Precautions", getValue: (p) => p.precautions },
  ];

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
        Side-by-Side
      </span>
      <h1 className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Compare Plants
      </h1>
      <p className="text-muted mb-6">Compare care needs, uses, and safety across up to 4 plants.</p>

      <select
        value={dropdownValue}
        onChange={(e) => handleAddPlant(e.target.value)}
        className="border-2 border-primary/20 rounded-full px-4 py-2.5 mb-8 bg-white font-medium text-primary text-sm"
      >
        <option value="">+ Add a plant to compare...</option>
        {availableOptions.map((p) => (
          <option key={p._id} value={p._id}>{p.commonName}</option>
        ))}
      </select>

      {selectedPlants.length === 0 ? (
        <div
          className="
    bg-white/70
    backdrop-blur-xl
    border-2
    border-dashed
    border-sage/40
    rounded-[32px]
    p-16
    text-center
    shadow-lg
  "
        >
          <div className="text-6xl mb-5">🌱</div>

          <h2
            className="
      text-2xl
      font-bold
      text-primary
    "
          >
            Your plant arena is empty
          </h2>

          <p className="text-muted mt-3">
            Choose plants above and discover their strengths side-by-side.
          </p>

          <div
            className="
      mt-6
      inline-flex
      bg-sage/20
      text-primary
      px-5
      py-2
      rounded-full
      text-sm
      font-semibold
    "
          >
            🌿 Add two plants to begin
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-cream">
                <th className="text-left p-4 text-muted font-bold text-xs uppercase tracking-wide">
                  Attribute
                </th>
                {selectedPlants.map((plant) => {
                  const imagePath = `/images/plants/${slugify(plant.commonName)}.jpg`;
                  return (
                    <th
                      key={plant._id}
                      className="
    text-left
    p-5
    min-w-[220px]
  "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
    w-16 h-16
    rounded-3xl
    bg-sage/30
    overflow-hidden
    shrink-0
    relative
    shadow-md
    rotate-3
    hover:rotate-0
    transition-all
    duration-300
  "
                        >
                          <img
                            src={imagePath}
                            alt={plant.commonName}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div>
                          <Link
                            href={`/plants/${plant._id}`}
                            className="
    font-bold
    text-primary
    text-base
    hover:text-gold
    transition-colors
  "
                          >
                            {plant.commonName}
                          </Link>
                          <p className="italic text-xs text-muted font-normal">
                            {plant.botanicalName}
                          </p>
                          <button
                            onClick={() => handleRemovePlant(plant._id)}
                            className="text-[10px] text-clay mt-0.5 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}
                >
                  <td className="p-4 text-muted font-bold text-xs uppercase tracking-wide">
                    {row.label}
                  </td>
                  {selectedPlants.map((plant) => (
                    <td key={plant._id} className="p-4 text-gray-700">
                      {row.getValue(plant) || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
