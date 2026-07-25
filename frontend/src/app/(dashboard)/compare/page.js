"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ComparePage() {
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants`)
      .then((res) => res.json())
      .then((data) => setAllPlants(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddPlant = (plantId) => {
    if (!plantId) return;
    if (selectedPlants.length >= 4) {
      alert("You can compare up to 4 plants at a time.");
      return;
    }
    const plant = allPlants.find((p) => p._id === plantId);
    if (plant && !selectedPlants.some((p) => p._id === plantId)) {
      setSelectedPlants([...selectedPlants, plant]);
    }
    setDropdownValue("");
  };

  const handleRemovePlant = (plantId) => {
    setSelectedPlants(selectedPlants.filter((p) => p._id !== plantId));
  };

  const availableOptions = allPlants.filter(
    (p) => !selectedPlants.some((sp) => sp._id === p._id)
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
    { label: "Active Compounds", getValue: (p) => p.activeCompounds?.join(", ") },
    { label: "Studies Cited", getValue: (p) => p.studiesCited },
    { label: "Precautions", getValue: (p) => p.precautions },
  ];

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Compare Plants</h1>
      <p className="text-muted mb-6">
        Side-by-side comparison across medicinal, care, and botanical attributes.
      </p>

      <select
        value={dropdownValue}
        onChange={(e) => handleAddPlant(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-8 bg-white"
      >
        <option value="">+ Add a plant to compare...</option>
        {availableOptions.map((p) => (
          <option key={p._id} value={p._id}>
            {p.commonName}
          </option>
        ))}
      </select>

      {selectedPlants.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-muted">
          Add at least 2 plants above to see a comparison.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-muted font-medium">Attribute</th>
                {selectedPlants.map((plant) => (
                  <th key={plant._id} className="text-left p-4 min-w-[180px]">
                    <Link
                      href={`/plants/${plant._id}`}
                      className="font-semibold text-gray-900 hover:text-primary"
                    >
                      {plant.commonName}
                    </Link>
                    <p className="italic text-xs text-muted font-normal">
                      {plant.botanicalName}
                    </p>
                    <button
                      onClick={() => handleRemovePlant(plant._id)}
                      className="text-xs text-red-500 mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-4 text-muted font-medium">{row.label}</td>
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