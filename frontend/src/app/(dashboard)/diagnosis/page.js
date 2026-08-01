"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

export default function DiagnosisPage() {
  const { token } = useAuth();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [symptoms, setSymptoms] = useState("");
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
      const base64Only = fullResult.split(",")[1];

      setImageBase64(base64Only);
      setImagePreview(fullResult);
    };

    reader.readAsDataURL(file);
  };

  const handleDiagnose = async () => {
    if (!imageBase64) {
      setError("Please upload a photo first.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/diagnosis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageBase64,
            mimeType,
            plantName,
            symptoms,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        // Log successful diagnosis
        if (token) {
          logActivity(token, {
            type: "diagnosed_plant",
            title: data.diseaseName,
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

  const severityColor = {
    Low: "text-primary bg-sage/20",
    Moderate: "text-gold bg-gold/10",
    High: "text-clay bg-clay/10",
  };

  return (
    <main
      className="
min-h-screen
bg-cream
relative
overflow-hidden
px-5
py-8
lg:px-10
"
    >
      <div
        className="
absolute
-top-40
-right-40
w-[420px]
h-[420px]
rounded-full
bg-sage/20
blur-3xl
"
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          w-[300px]
          h-[300px]
          rounded-full
          bg-gold/10
          blur-3xl
          "
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Plant Disease Diagnosis
      </h1>

      <p className="text-muted mb-8">
        Upload a photo of a sick plant. Our AI will identify the issue and
        suggest treatment.
      </p>

      <div
        className="bg-white bg-white/80
backdrop-blur-xl
border border-primary/10
rounded-3xl
p-6
shadow-[0_25px_70px_-30px_rgba(31,61,43,0.35)]
 mb-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload affected plant photo
        </label>

        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded plant"
            className="w-full max-h-80 object-cover rounded-xl mb-4"
          />
        ) : (
          <div
            className="border-2
border-dashed
border-primary/20
bg-sage/10
rounded-3xl
 rounded-xl p-10 text-center text-muted mb-4"
          >
            No photo uploaded yet
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 text-sm"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Which plant is this? (optional)
        </label>

        <input
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="e.g. Tulsi (Holy Basil)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Describe the symptoms you're seeing (optional)
        </label>

        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. Yellow-brown spots on leaves, wilting..."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <button
          onClick={handleDiagnose}
          disabled={loading}
          className="bg-primary text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Diagnose Plant"}
        </button>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>

      {result && (
        <div
          className="bg-white/80
backdrop-blur-xl
border border-primary/10
rounded-3xl
p-6
shadow-[0_25px_70px_-30px_rgba(31,61,43,0.35)]
 space-y-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {result.diseaseName}
              </h2>

              {result.scientificName && (
                <p className="italic text-sm text-muted">
                  {result.scientificName}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {result.confidence}%
              </p>
              <p className="text-xs text-muted">confidence</p>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {result.description}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div
              className={`rounded-xl p-3 text-center ${
                severityColor[result.severity] || "bg-gray-50"
              }`}
            >
              <p className="text-xs text-muted mb-1">Severity</p>
              <p className="font-semibold text-sm">{result.severity}</p>
            </div>

            <div className="rounded-xl p-3 text-center bg-gray-50">
              <p className="text-xs text-muted mb-1">Spread Risk</p>
              <p className="font-semibold text-sm">{result.spreadRisk}</p>
            </div>

            <div className="rounded-xl p-3 text-center bg-gray-50">
              <p className="text-xs text-muted mb-1">Action Urgency</p>
              <p className="font-semibold text-sm">{result.actionUrgency}</p>
            </div>
          </div>

          {result.possibleCauses?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Possible Causes
              </h3>

              <div className="space-y-2">
                {result.possibleCauses.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start bg-gray-50 rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {c.cause}
                      </p>
                      <p className="text-xs text-muted">{c.explanation}</p>
                    </div>

                    <span className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 whitespace-nowrap ml-2">
                      {c.likelihood}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.suggestedTreatments?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Suggested Treatments
              </h3>

              <div className="space-y-2">
                {result.suggestedTreatments.map((t, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">
                      {t.name}
                      <span className="text-xs text-muted font-normal">
                        {" "}
                        · {t.type}
                      </span>
                    </p>

                    <p className="text-xs text-gray-700 mt-1">
                      {t.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.preventiveCare?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Preventive Care
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.preventiveCare.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-primary">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.otherPossibilities?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Other Possibilities
              </h3>

              <div className="space-y-1">
                {result.otherPossibilities.map((o, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>{o.name}</span>
                    <span className="text-muted">{o.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            ⚠️ This AI diagnosis is for educational purposes. For valuable or
            commercially grown plants, consult a certified plant pathologist.
          </div>
        </div>
      )}
    </main>
  );
}
