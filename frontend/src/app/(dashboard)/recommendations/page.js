"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

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
  const { token } = useAuth();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ goals: [] });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("recommendationResults");
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

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
      setAnswers((prev) => ({
        ...prev,
        [current.key]: value,
      }));
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
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(answers),
          },
        );

        const data = await res.json();

        setResults(data);

        if (token) {
          logActivity(token, {
            type: "recommendation_quiz",
            title: "Completed recommendation quiz",
            subtitle: `${data.length} matches found`,
          });
        }

        sessionStorage.setItem("recommendationResults", JSON.stringify(data));
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
    sessionStorage.removeItem("recommendationResults");
  };

  const canProceed = current?.multi
    ? answers.goals.length > 0
    : !!answers[current?.key];

  if (results) {
    return (
      <main
        className="
min-h-screen
bg-gradient-to-br
from-[#f2f8e9]
via-[#fffdf5]
to-[#e6f3df]
px-6
py-12
"
      >
        <div className="max-w-2xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold mb-3">
                  🌱 Your Plant Match
                </div>

                <h1 className="text-4xl font-bold text-primary">
                  Plants picked for you
                </h1>

                <p className="text-muted mt-2">
                  Based on your lifestyle, space and growing conditions.
                </p>
              </div>

              <button
                onClick={handleRestart}
                className="
              bg-white
              border border-green-200
              text-primary
              px-5 py-2.5
              rounded-full
              text-sm
              font-semibold
              hover:bg-green-50
              transition
            "
              >
                ↻ Restart
              </button>
            </div>

            {results.length === 0 ? (
              <div
                className="
            bg-white/80
            backdrop-blur
            border border-green-100
            rounded-3xl
            p-12
            text-center
          "
              >
                <div className="text-5xl mb-4">🌿</div>
                <p className="text-gray-700">No strong matches yet.</p>
                <p className="text-sm text-muted mt-2">
                  Try adjusting your preferences.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/plants/${r.id}`}
                    className="
                  group
                  bg-white/80
                  backdrop-blur
                  border border-green-100
                  rounded-3xl
                  p-6
                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:shadow-green-900/10
                  transition-all
                "
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className="
                      text-xl
                      font-bold
                      text-gray-900
                      group-hover:text-primary
                    "
                        >
                          {r.commonName}
                        </h3>

                        <p className="italic text-sm text-muted">
                          {r.botanicalName}
                        </p>
                      </div>

                      <div
                        className="
                    bg-green-100
                    text-green-700
                    rounded-full
                    px-4 py-2
                    font-bold
                  "
                      >
                        {r.matchScore}%
                      </div>
                    </div>

                    <div
                      className="
                  mt-5
                  space-y-2
                "
                    >
                      {r.reasons.map((reason, i) => (
                        <div
                          key={i}
                          className="
                        flex gap-2
                        text-sm
                        text-gray-700
                        bg-green-50
                        rounded-xl
                        px-3 py-2
                      "
                        >
                          <span>🌱</span>
                          {reason}
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
        </div>

        <div
          className="
h-3
bg-green-100
rounded-full
overflow-hidden
shadow-inner
"
        >
          <div
            className="
h-full
bg-gradient-to-r
from-green-500
to-emerald-400
rounded-full
transition-all
duration-500
"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
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
              className={`

w-full
text-left
px-5
py-5
rounded-2xl
border-2
font-medium
transition-all
duration-200

${
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
