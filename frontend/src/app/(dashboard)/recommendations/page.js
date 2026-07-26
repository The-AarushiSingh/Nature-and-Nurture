"use client";
import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    key: "climate",
    title: "What's your climate like?",
    subtitle: "This helps us recommend plants suited to your conditions.",
    options: [
      { value: "Tropical", label: "Tropical / Humid" },
      { value: "Temperate", label: "Temperate / Moderate" },
      { value: "Arid", label: "Arid / Dry" },
      { value: "Subtropical", label: "Subtropical" },
    ],
  },
  {
    key: "space",
    title: "Where are you growing?",
    subtitle: "Indoor and outdoor plants have different needs.",
    options: [
      { value: "indoor", label: "Indoor (balcony, windowsill)" },
      { value: "outdoor", label: "Outdoor (garden, terrace)" },
    ],
  },
  {
    key: "sunlight",
    title: "How much sunlight do you get?",
    subtitle: "Be honest — this really affects what'll survive.",
    options: [
      { value: "Full Sun", label: "Full sun most of the day" },
      { value: "Partial", label: "Partial shade" },
      { value: "Low", label: "Mostly shade / low light" },
    ],
  },
  {
    key: "maintenance",
    title: "How much upkeep do you want?",
    subtitle: "No shame in picking low — busy schedules are real.",
    options: [
      { value: "low", label: "Low — set it and forget it" },
      { value: "medium", label: "Medium — weekly attention is fine" },
      { value: "high", label: "High — I enjoy hands-on gardening" },
    ],
  },
  {
    key: "goals",
    title: "What are you hoping for?",
    subtitle: "Pick as many as apply.",
    multi: true,
    options: [
      { value: "Stress Relief", label: "Stress relief" },
      { value: "Immunity", label: "Immunity support" },
      { value: "Digestion", label: "Digestion" },
      { value: "Sleep", label: "Better sleep" },
      { value: "Culinary", label: "Cooking / kitchen use" },
      { value: "Skin Care", label: "Skin care" },
    ],
  },
];

export default function RecommendationsPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ goals: [] });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const current = steps[step];

  const handleSelect = (value) => {
    if (current.multi) {
      setAnswers((prev) => {
        const already = prev.goals.includes(value);
        return {
          ...prev,
          goals: already
            ? prev.goals.filter((g) => g !== value)
            : [...prev.goals, value],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [current.key]: value }));
    }
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers),
          }
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestart = () => {
    setAnswers({ goals: [] });
    setStep(0);
    setResults(null);
  };

  const canProceed = current?.multi
    ? answers.goals.length > 0
    : !!answers[current?.key];

  if (results) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
            <p className="text-muted text-sm">
              Based on your answers, here's what should thrive for you.
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="text-sm text-primary underline"
          >
            Start over
          </button>
        </div>

        {results.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-muted">
            No strong matches found — try different answers, or browse the full collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((r) => (
              <Link
                key={r.id}
                href={`/plants/${r.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{r.commonName}</h3>
                    <p className="italic text-xs text-muted">{r.botanicalName}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {r.matchScore}%
                  </span>
                </div>
                <div className="space-y-1">
                  {r.reasons.map((reason, i) => (
                    <p key={i} className="text-xs text-gray-600">
                      ✓ {reason}
                    </p>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{current.title}</h1>
      <p className="text-muted text-sm mb-6">{current.subtitle}</p>

      <div className="space-y-3 mb-8">
        {current.options.map((opt) => {
          const isSelected = current.multi
            ? answers.goals.includes(opt.value)
            : answers[current.key] === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm text-muted"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed || loading}
          className="bg-primary text-white rounded-full px-6 py-2.5 font-medium hover:bg-primary-light transition-colors disabled:opacity-40"
        >
          {loading
            ? "Finding matches..."
            : step === steps.length - 1
            ? "Get My Recommendations"
            : "Continue →"}
        </button>
      </div>
    </main>
  );
}