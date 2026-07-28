"use client";
import Link from "next/link";

const features = [
  { icon: "🤖", title: "AI Plant Assistant", desc: "Ask anything about medicinal plants — grounded in our real database, not guesses.", href: "/assistant" },
  { icon: "📷", title: "Plant Identification", desc: "Upload a photo, get an instant ID with Hindi name and care details.", href: "/plant-id" },
  { icon: "✨", title: "Personalized Recommendations", desc: "Answer a few questions, get plants matched to your space and goals.", href: "/recommendations" },
  { icon: "🩺", title: "Disease Diagnosis", desc: "Upload a photo of a sick plant for AI-powered treatment guidance.", href: "/diagnosis" },
  { icon: "💚", title: "My Garden", desc: "Save plants you're growing or curious about, all in one place.", href: "/garden" },
  { icon: "📊", title: "Compare Plants", desc: "Side-by-side comparison of care needs, uses, and safety across plants.", href: "/compare" },
];

export default function LandingPage() {
  return (
    <main className="bg-cream">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
              AI-powered plant discovery
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Grow what heals, and what you'll actually use.
            </h1>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              35 medicinal and kitchen-garden plants, an AI assistant grounded
              in real data, and tools to identify, diagnose, and care for
              what you grow — from Ashwagandha to the basil on your windowsill.
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="bg-primary text-white rounded-full px-6 py-3 font-medium hover:bg-primary-light transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/explore"
                className="border border-gray-300 rounded-full px-6 py-3 font-medium hover:bg-white transition-colors"
              >
                Explore Plants
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <img
              src="/images/login-hero.jpg"
              alt="Herbs and spices"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Honest stats — no fabricated numbers */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>35</p>
            <p className="text-sm text-muted">Curated plants</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>3</p>
            <p className="text-sm text-muted">AI-powered features</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>100%</p>
            <p className="text-sm text-muted">Answers grounded in real data</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-primary text-center mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Everything you need to grow and heal
        </h2>
        <p className="text-muted text-center mb-12">
          From AI-powered discovery to personalized cultivation guides.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Honest "why I built this" instead of fake testimonials */}
      <section className="bg-primary">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-sage text-xs uppercase tracking-widest font-semibold mb-4">
            Why this exists
          </p>
          <p className="text-white text-xl leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
            Ayurvedic and kitchen-garden knowledge is scattered across forums,
            old books, and half-remembered advice. Nature & Nurture puts it in
            one place — grounded in real data, verified with AI, and built for
            people who actually want to grow this stuff at home.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Start your botanical journey today
        </h2>
        <p className="text-muted mb-6">Free to get started. No credit card required.</p>
        <Link
          href="/login"
          className="inline-block bg-primary text-white rounded-full px-8 py-3 font-medium hover:bg-primary-light transition-colors"
        >
          Get Started Free
        </Link>
      </section>
    </main>
  );
}