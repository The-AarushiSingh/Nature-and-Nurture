"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const categories = [
  "Immunity",
  "Digestion",
  "Stress Relief",
  "Culinary",
  "Skin Care",
  "Respiratory",
  "Sleep",
  "Cognitive",
];

const features = [
  {
    icon: "🤖",
    title: "AI Plant Assistant",
    desc: "Ask anything about medicinal plants — grounded in our real database, not guesses.",
    href: "/assistant",
  },
  {
    icon: "📷",
    title: "Plant Identification",
    desc: "Upload a photo, get an instant ID with Hindi name and care details.",
    href: "/plant-id",
  },
  {
    icon: "✨",
    title: "Personalized Recommendations",
    desc: "Answer a few questions, get plants matched to your space and goals.",
    href: "/recommendations",
  },
  {
    icon: "🩺",
    title: "Disease Diagnosis",
    desc: "Upload a photo of a sick plant for AI-powered treatment guidance.",
    href: "/diagnosis",
  },
  {
    icon: "💚",
    title: "My Garden",
    desc: "Save plants you're growing or curious about, all in one place.",
    href: "/garden",
  },
  {
    icon: "📊",
    title: "Compare Plants",
    desc: "Side-by-side comparison of care needs, uses, and safety across plants.",
    href: "/compare",
  },
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
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants`)
      .then((res) => res.json())
      .then((data) => setFeaturedPlants(data.slice(0, 6)))
      .catch(() => setFeaturedPlants([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(
      `/explore${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`,
    );
  };

  return (
    <main className="bg-cream">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 overflow-hidden">
        {/* Marquee ticker */}
        <div className="overflow-hidden border-y border-gray-200 py-2 mb-14 -mx-6">
          <div className="flex gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
            {[...Array(3)]
              .flatMap(() => [
                "ASHWAGANDHA अश्वगंधा",
                "TULSI तुलसी",
                "HALDI हल्दी",
                "NEEM नीम",
                "GILOY गिलोय",
                "AMLA आंवला",
                "MINT पुदीना",
                "CILANTRO धनिया",
                "THYME थाइम",
                "ROSEMARY रोजमेरी",
                "CLOVE लौंग",
                "CINNAMON दालचीनी",
                "MORINGA सहजन",
                "LEMONGRASS लेमनग्रास",
                "OREGANO ऑरेगैनो",
                "BASIL बेसिल",
                "GINGER अदरक",
                "GARLIC लहसुन",
                "FENNEL सौंफ",
                "CUMIN जीरा",
                "CORIANDER धनिया",
                "CARDAMOM इलायची",
              ])
              .map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold tracking-widest text-primary/60"
                >
                  {item} &nbsp;•
                </span>
              ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-gold text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-6 -rotate-2">
              AI-Powered Plant Discovery
            </span>

            <h1
              className="text-6xl sm:text-7xl leading-[0.92] font-bold tracking-tight text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Grow what
              <br />
              <span className="relative inline-block">
                heals
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,8 Q50,0 100,6 T200,4"
                    stroke="#C17A1F"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="text-sage">& thrives.</span>
            </h1>

            <p className="mt-6 max-w-lg text-gray-600 text-lg leading-relaxed">
              35 plants. Real AI, grounded in real data — not guesses. Identify,
              diagnose, and grow with confidence.
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
              <Link
                href="/explore"
                className="rounded-full bg-gold px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity"
              >
                Explore Plants
              </Link>
              <Link
                href="/assistant"
                className="rounded-full border-2 border-primary px-6 py-3 font-bold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Ask AI →
              </Link>
            </div>
          </div>

          {/* Collage-style image stack */}
          <div className="relative h-[440px]">
            <div className="absolute top-0 right-4 w-64 h-80 rotate-6 shadow-2xl rounded-3xl overflow-hidden border-4 border-white z-10 hover:rotate-3 hover:scale-105 transition-transform duration-300">
              <img
                src="/images/login-hero.jpg"
                alt="Herbs"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 left-0 w-52 h-52 -rotate-6 bg-sage rounded-3xl shadow-xl border-4 border-white flex flex-col justify-center items-center p-4 hover:-rotate-3 transition-transform duration-300">
              <p
                className="text-4xl font-bold text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                35+
              </p>
              <p className="text-xs text-primary/70 font-semibold text-center mt-1">
                plants, medicinal + culinary
              </p>
            </div>

            <div className="absolute bottom-16 right-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(31,61,43,0.4)] p-4 w-56 border border-white/60 rotate-3 hover:rotate-0 transition-transform duration-300 z-20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  AI
                </div>
                <p className="text-xs font-bold">Nature AI</p>
              </div>
              <p className="text-xs text-gray-600 leading-snug">
                "What helps with stress?" →{" "}
                <span className="text-primary font-semibold">
                  Ashwagandha, Lavender
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories — scattered pill collage */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-5">
          Browse Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              href={`/explore?category=${encodeURIComponent(cat)}`}
              className={`border-2 border-primary rounded-full px-5 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-200 ${
                i % 3 === 0
                  ? "rotate-2"
                  : i % 3 === 1
                    ? "-rotate-1"
                    : "rotate-1"
              } hover:rotate-0`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Plants — color-blocked specimen cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2
              className="text-3xl font-bold text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Featured Specimens
            </h2>
            <p className="text-muted text-sm mt-1">
              Straight from our database — no stock photos.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-sm font-bold text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {featuredPlants.map((p, i) => {
            const colors = [
              "bg-primary",
              "bg-gold",
              "bg-sage",
              "bg-clay",
              "bg-berry",
            ];
            const bg = colors[i % colors.length];
            const rotations = [
              "rotate-2",
              "-rotate-2",
              "rotate-1",
              "-rotate-1",
              "rotate-3",
              "-rotate-3",
            ];
            const rot = rotations[i % rotations.length];

            const slug = p.commonName
              .toLowerCase()
              .replace(/[()]/g, "")
              .replace(/\s+/g, "-");
            const imagePath = `/images/plants/${slug}.jpg`;

            return (
              <Link
                key={p._id}
                href={`/plants/${p._id}`}
                className={`${rot} hover:rotate-0 hover:scale-105 rounded-2xl shadow-lg border-4 border-white transition-all duration-300 h-36 relative overflow-hidden group`}
              >
                <img
                  src={imagePath}
                  alt={p.commonName}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  className={`absolute inset-0 ${bg} opacity-70 group-[:has(img[style*="display: none"])]:opacity-100`}
                />

                <div className="relative h-full p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wide drop-shadow">
                    {p.category}
                  </span>
                  <div>
                    <p
                      className="font-bold text-white text-sm leading-tight drop-shadow"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.commonName}
                    </p>
                    {p.hindiName && (
                      <p className="text-white/90 text-xs mt-0.5 drop-shadow">
                        {p.hindiName}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Honest stats — collage badges instead of a boring row */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-primary rotate-2 hover:rotate-0 transition-transform duration-300 rounded-3xl p-6 text-center shadow-lg border-4 border-white">
            <p
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              35
            </p>
            <p className="text-xs text-white/70 font-semibold mt-1">
              Curated plants
            </p>
          </div>
          <div className="bg-gold -rotate-2 hover:rotate-0 transition-transform duration-300 rounded-3xl p-6 text-center shadow-lg border-4 border-white">
            <p
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              3
            </p>
            <p className="text-xs text-white/70 font-semibold mt-1">
              AI-powered features
            </p>
          </div>
          <div className="bg-sage rotate-1 hover:rotate-0 transition-transform duration-300 rounded-3xl p-6 text-center shadow-lg border-4 border-white">
            <p
              className="text-4xl font-bold text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              100%
            </p>
            <p className="text-xs text-primary/70 font-semibold mt-1">
              Grounded in real data
            </p>
          </div>
        </div>
      </section>

      {/* Features grid — sticker-style cards */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-white">
        <div className="text-center mb-14">
          <span className="inline-block bg-sage/30 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full -rotate-1 mb-4">
            Platform Features
          </span>
          <h2
            className="text-4xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need to
            <br />
            <span className="text-gold">grow & heal</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const badgeColors = [
              "bg-primary",
              "bg-gold",
              "bg-sage",
              "bg-clay",
              "bg-berry",
              "bg-primary",
            ];
            const badge = badgeColors[i % badgeColors.length];
            const tilt = i % 2 === 0 ? "-rotate-1" : "rotate-1";

            return (
              <Link
                key={f.title}
                href={f.href}
                className={`group bg-cream border-2 border-primary/10 rounded-3xl p-7 ${tilt} hover:rotate-0 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(31,61,43,0.3)] transition-all duration-300`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${badge} flex items-center justify-center text-2xl mb-5 rotate-6 shadow-md border-2 border-white`}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-bold text-primary text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {f.desc}
                </p>
                <span className="text-xs font-bold text-primary group-hover:underline">
                  Try it →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* RAG Assistant deep-dive */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white border-2 border-primary/10 rounded-3xl shadow-xl p-5 -rotate-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                🤖
              </div>
              <p className="text-sm font-bold text-primary">Nature AI</p>
              <span className="ml-auto text-[10px] text-green-600 font-semibold">
                ● Online
              </span>
            </div>
            <div className="bg-primary text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 mb-3 ml-auto w-fit max-w-[85%]">
              Can Tulsi grow indoors?
            </div>
            <div className="bg-cream text-sm text-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[92%] leading-relaxed">
              Yes — Tulsi (तुलसी) does well indoors with full sun exposure,
              moderate watering, and loamy soil. It's rated "Easy" difficulty
              with a fast growth rate.
              <div className="flex gap-1.5 mt-2">
                <span className="text-xs bg-gold/20 text-gold font-semibold px-2 py-0.5 rounded-full">
                  Holy Basil
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full rotate-1 mb-4">
              RAG-Powered AI
            </span>
            <h2
              className="text-3xl font-bold text-primary mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your personal <span className="text-gold">plant herbalist</span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Every answer is retrieved from our own curated plant database
              first, then used to ground the AI's response — not pulled from
              general internet knowledge.
            </p>
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: "📚",
                  title: "Cited Knowledge Base",
                  desc: "Every response links back to real plants in our database.",
                },
                {
                  icon: "🎯",
                  title: "Semantic Retrieval",
                  desc: "Finds relevant plants by meaning, not just keyword matching.",
                },
                {
                  icon: "🌐",
                  title: "Culturally Aware",
                  desc: "Includes Hindi names and India-relevant plants throughout.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage/25 flex items-center justify-center text-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/assistant"
              className="inline-block bg-primary text-white rounded-full px-6 py-3 font-bold hover:bg-primary-light transition-colors"
            >
              Chat with AI →
            </Link>
          </div>
        </div>
      </section>

      {/* Recommendations wizard preview */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full -rotate-1 mb-4">
                Personalized Wizard
              </span>
              <h2
                className="text-3xl font-bold text-primary mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Find your perfect{" "}
                <span className="text-sage">healing plants</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Answer a few quick questions about your climate, space, and
                goals — get ranked matches with the real reasoning behind each
                one.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: "🌍", label: "Climate & Space" },
                  { icon: "☀️", label: "Sunlight" },
                  { icon: "💪", label: "Maintenance" },
                  { icon: "🎯", label: "Health Goals" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-cream rounded-xl p-3 flex items-center gap-2 border border-primary/10"
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs font-semibold text-primary">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/recommendations"
                className="inline-block bg-gold text-white rounded-full px-6 py-3 font-bold hover:opacity-90 transition-opacity"
              >
                Start Recommendation Wizard →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "Holy Basil",
                  hindi: "तुलसी",
                  tags: "Immunity · Stress · Respiratory",
                  score: 96,
                },
                {
                  name: "Peppermint",
                  hindi: "पिपरमिंट",
                  tags: "Digestion · Headache",
                  score: 88,
                },
                {
                  name: "Aloe Vera",
                  hindi: "घृतकुमारी",
                  tags: "Skin Care · Digestion",
                  score: 82,
                },
              ].map((p, i) => (
                <div
                  key={p.name}
                  className={`bg-white border-2 border-primary/10 rounded-2xl p-4 flex items-center justify-between shadow-md ${
                    i % 2 === 0 ? "rotate-1" : "-rotate-1"
                  } hover:rotate-0 transition-transform duration-300`}
                >
                  <div>
                    <p className="font-bold text-primary text-sm">
                      {p.name} · {p.hindi}
                    </p>
                    <p className="text-xs text-gray-500">{p.tags}</p>
                  </div>
                  <span className="text-lg font-bold text-gold">
                    {p.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plant ID showcase */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-primary rounded-[2.5rem] p-12 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full rotate-1 mb-4">
                AI Vision
              </span>
              <h2
                className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Identify any plant
                <br />
                <span className="text-gold">from a single photo</span>
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Upload any plant photo — our AI identifies the species,
                cross-checks our database, and gives you Hindi names and care
                details instantly.
              </p>
              <Link
                href="/plant-id"
                className="inline-block bg-white text-primary rounded-full px-6 py-3 font-bold hover:scale-105 transition-transform duration-200"
              >
                Try Plant ID →
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur border-2 border-dashed border-white/30 rounded-2xl p-8 text-center rotate-1">
              <p className="text-white/60 text-sm mb-3">
                📷 Drop a photo or browse
              </p>
              <div className="bg-white/90 rounded-xl p-3 text-left mt-4">
                <p className="text-primary font-bold text-sm">
                  Peacock Plant
                </p>
                <p className="text-gray-500 text-xs italic">
                  Goeppertia makoyana · 88% match
                </p>
              </div>
            </div>
          </div>
          <p
            className="absolute -bottom-10 -right-6 text-[9rem] font-bold text-white/5 select-none pointer-events-none leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ID
          </p>
        </div>
      </section>

      {/* Why this exists */}
      <section className="relative bg-primary overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center relative z-10">
          <span className="inline-block bg-gold text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full rotate-2 mb-6">
            Why this exists
          </span>
          <p
            className="text-white text-2xl sm:text-3xl leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ayurvedic and kitchen-garden knowledge is scattered across forums,
            old books, and half-remembered advice.{" "}
            <span className="text-sage">
              Nature & Nurture puts it in one place
            </span>{" "}
            — grounded in real data, verified with AI, built for people who
            actually want to grow this stuff at home.
          </p>
        </div>
        {/* Decorative oversized background text */}
        <p
          className="absolute -bottom-6 left-0 w-full text-center text-[10rem] font-bold text-white/5 select-none pointer-events-none leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          NURTURE
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <span className="inline-block bg-clay/15 text-clay text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full rotate-1 mb-4">
            Questions
          </span>
          <h2
            className="text-4xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-cream border-2 border-primary/10 rounded-2xl overflow-hidden transition-all duration-300 ${
                openFaq === i ? "shadow-lg" : ""
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
              >
                <span className="font-bold text-primary text-sm">{faq.q}</span>
                <span
                  className={`shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold transition-transform duration-300 ${
                    openFaq === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gold rounded-[2.5rem] p-14 -rotate-1 shadow-2xl border-4 border-white">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start your botanical journey today
          </h2>
          <p className="text-white/80 mb-8">
            Free to get started. No credit card required.
          </p>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-block bg-white text-primary rounded-full px-8 py-3.5 font-bold hover:scale-105 transition-transform duration-200"
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}