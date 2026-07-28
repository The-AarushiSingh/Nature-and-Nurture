"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = ["Immunity", "Digestion", "Stress Relief", "Culinary", "Skin Care", "Respiratory", "Sleep", "Cognitive"];

const features = [
  { icon: "🤖", title: "AI Plant Assistant", desc: "Ask anything about medicinal plants — grounded in our real database, not guesses.", href: "/assistant" },
  { icon: "📷", title: "Plant Identification", desc: "Upload a photo, get an instant ID with Hindi name and care details.", href: "/plant-id" },
  { icon: "✨", title: "Personalized Recommendations", desc: "Answer a few questions, get plants matched to your space and goals.", href: "/recommendations" },
  { icon: "🩺", title: "Disease Diagnosis", desc: "Upload a photo of a sick plant for AI-powered treatment guidance.", href: "/diagnosis" },
  { icon: "💚", title: "My Garden", desc: "Save plants you're growing or curious about, all in one place.", href: "/garden" },
  { icon: "📊", title: "Compare Plants", desc: "Side-by-side comparison of care needs, uses, and safety across plants.", href: "/compare" },
];

const faqs = [
  {
    q: "How does the AI Assistant avoid making things up?",
    a: "It uses Retrieval-Augmented Generation (RAG): your question is matched against our actual plant database using semantic search, and the AI answers only using the real data retrieved — not general internet knowledge.",
  },
  {
    q: "Is the plant identification always accurate?",
    a: "No AI identification is 100% reliable. It gives a confidence score with every result, and for plants in our curated database, you get a direct link to verified information.",
  },
  {
    q: "Is this a substitute for medical advice?",
    a: "No. All medicinal information is educational. Always consult a healthcare professional before using any plant medicinally, especially during pregnancy or alongside medication.",
  },
  {
    q: "How many plants are in the database?",
    a: "35 curated plants, spanning Ayurvedic medicinal herbs and everyday culinary/kitchen-garden plants, with more being added over time.",
  },
];

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants`)
      .then((res) => res.json())
      .then((data) => setFeaturedPlants(data.slice(0, 6)))
      .catch(() => setFeaturedPlants([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/explore${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`);
  };

  return (
    <main className="bg-cream">
{/* Hero */}
<section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 overflow-hidden">
  {/* Marquee ticker */}
  <div className="overflow-hidden border-y border-gray-200 py-2 mb-14 -mx-6">
    <div className="flex gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
      {[...Array(3)].flatMap(() =>
        ["ASHWAGANDHA अश्वगंधा", "TULSI तुलसी", "HALDI हल्दी", "NEEM नीम", "GILOY गिलोय", "AMLA आंवला"]
      ).map((item, i) => (
        <span key={i} className="text-xs font-semibold tracking-widest text-primary/60">
          {item} &nbsp;•
        </span>
      ))}
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-16 items-center">
    <div>
      <span className="inline-flex items-center rounded-full bg-gold text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-6 -rotate-2">
        🌿 AI-Powered Plant Discovery
      </span>

      <h1
        className="text-6xl sm:text-7xl leading-[0.92] font-bold tracking-tight text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Grow what
        <br />
        <span className="relative inline-block">
          heals
          <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" preserveAspectRatio="none">
            <path d="M0,8 Q50,0 100,6 T200,4" stroke="#C17A1F" strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        </span>
        <br />
        <span className="text-sage">& thrives.</span>
      </h1>

      <p className="mt-6 max-w-lg text-gray-600 text-lg leading-relaxed">
        35 plants. Real AI, grounded in real data — not guesses.
        Identify, diagnose, and grow with confidence.
      </p>

      <form onSubmit={handleSearch} className="mt-8 flex max-w-md">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search medicinal plants..."
          className="flex-1 rounded-l-full border-2 border-r-0 border-primary px-5 py-3 outline-none bg-white"
        />
        <button className="px-7 rounded-r-full bg-primary text-white font-bold hover:bg-primary-light transition-colors">
          Search
        </button>
      </form>

      <div className="flex gap-3 mt-6">
        <Link href="/explore" className="rounded-full bg-gold px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity">
          Explore Plants
        </Link>
        <Link href="/assistant" className="rounded-full border-2 border-primary px-6 py-3 font-bold text-primary hover:bg-primary hover:text-white transition-colors">
          Ask AI →
        </Link>
      </div>
    </div>

    {/* Collage-style image stack */}
    <div className="relative h-[440px]">
      <div className="absolute top-0 right-4 w-64 h-80 rotate-6 shadow-2xl rounded-3xl overflow-hidden border-4 border-white z-10 hover:rotate-3 hover:scale-105 transition-transform duration-300">
        <img src="/images/login-hero.jpg" alt="Herbs" className="w-full h-full object-cover" />
      </div>

      <div className="absolute bottom-0 left-0 w-52 h-52 -rotate-6 bg-sage rounded-3xl shadow-xl border-4 border-white flex flex-col justify-center items-center p-4 hover:-rotate-3 transition-transform duration-300">
        <p className="text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>35+</p>
        <p className="text-xs text-primary/70 font-semibold text-center mt-1">plants, medicinal + culinary</p>
      </div>

      <div className="absolute bottom-16 right-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(31,61,43,0.4)] p-4 w-56 border border-white/60 rotate-3 hover:rotate-0 transition-transform duration-300 z-20">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">AI</div>
          <p className="text-xs font-bold">Nature AI</p>
        </div>
        <p className="text-xs text-gray-600 leading-snug">
          "What helps with stress?" → <span className="text-primary font-semibold">Ashwagandha, Lavender</span>
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Browse Categories */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Browse Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/explore?category=${encodeURIComponent(cat)}`}
              className="border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Plants — real data */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
              Featured Plants
            </h2>
            <p className="text-muted text-sm">Curated from our database</p>
          </div>
          <Link href="/explore" className="text-sm text-primary font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {featuredPlants.map((p) => (
            <Link
              key={p._id}
              href={`/plants/${p._id}`}
              className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all"
            >
              <p className="font-medium text-sm text-gray-900">{p.commonName}</p>
              <p className="italic text-xs text-muted">{p.botanicalName}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Honest stats */}
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

      {/* Features grid */}
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

      {/* Why this exists — honest, instead of fake testimonials */}
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

      {/* FAQ — real, honest answers */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-primary text-center mb-10" style={{ fontFamily: "var(--font-display)" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex justify-between items-center"
              >
                <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                <span className="text-muted">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
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