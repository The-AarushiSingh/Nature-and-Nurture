"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

export default function PlantIdPage() {
  const { token } = useAuth();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();

    reader.onloadend = () => {
      const fullResult = reader.result;
      setImageBase64(fullResult.split(",")[1]);
      setImagePreview(fullResult);
      setResult(null);
    };

    reader.readAsDataURL(file);
  };

  const handleIdentify = async () => {
    if (!imageBase64) {
      setError("Please upload a photo first.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plant-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageBase64,
            mimeType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        // Log successful plant identification
        if (token) {
          logActivity(token, {
            type: "identified_plant",
            title: `Identified ${data.commonName}`,
            subtitle: `${data.confidence}% confidence`,
          });
        }

        setResult(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Plant Identification
      </h1>

      <p className="text-muted mb-8">
        Upload a clear photo of any plant — our AI will identify it and show
        what it knows.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded plant"
            className="w-full max-h-80 object-cover rounded-xl mb-4"
          />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-muted mb-4">
            Drop your plant photo here, or choose a file below
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 text-sm"
        />

        <button
          onClick={handleIdentify}
          disabled={loading}
          className="bg-primary text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          {loading ? "Identifying..." : "Identify Plant"}
        </button>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {result.commonName}
                {result.hindiName && (
                  <span className="text-lg font-normal text-muted">
                    {" "}
                    · {result.hindiName}
                  </span>
                )}
              </h2>

              {result.botanicalName && (
                <p className="italic text-sm text-muted">
                  {result.botanicalName}
                </p>
              )}

              <p className="text-xs text-muted mt-1">{result.family}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {result.confidence}%
              </p>
              <p className="text-xs text-muted">match confidence</p>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {result.description}
          </p>

          {result.generalCare && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Sunlight</p>
                <p className="text-sm font-medium">
                  {result.generalCare.sunlight}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Water</p>
                <p className="text-sm font-medium">
                  {result.generalCare.water}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Difficulty</p>
                <p className="text-sm font-medium">
                  {result.generalCare.difficulty}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-700 mb-5">
            <span className="font-medium">Known uses:</span>{" "}
            {result.knownUses}
          </p>

          {result.inDatabase ? (
            <Link
              href={`/plants/${result.databasePlantId}`}
              className="inline-block bg-primary text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-primary-light transition-colors"
            >
              ✓ Found in our database — View Full Profile →
            </Link>
          ) : (
            <p className="text-xs text-muted bg-gray-50 rounded-lg p-3">
              This plant isn't in our curated database yet — showing general AI
              knowledge only.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
