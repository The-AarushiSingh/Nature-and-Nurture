# 🌿 Nature & Nurture

**AI-powered medicinal & culinary plant discovery, built for Indian home gardeners.**

[![Live Demo](https://img.shields.io/badge/demo-live-1F3D2B?style=for-the-badge)](https://nature-and-nurture.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/frontend-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Built with Express](https://img.shields.io/badge/backend-Express-C17A1F?style=for-the-badge&logo=express)](https://expressjs.com)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google_Gemini-8FAF7C?style=for-the-badge)](https://ai.google.dev)

**🔗 Live app:** [nature-and-nurture.vercel.app](https://nature-and-nurture.vercel.app)

---

## What is this?

Nature & Nurture bridges Ayurvedic and everyday kitchen-garden plant knowledge with modern AI — not as a chatbot bolted onto a plant database, but as an end-to-end system where every AI feature is genuinely grounded in real, curated data.

Built solo, end-to-end, as a full-stack + AI engineering portfolio project — from database schema design through a RAG pipeline, computer vision features, and production deployment.

Ayurvedic and kitchen-garden knowledge is scattered across forums, old books, and half-remembered advice. This puts it in one place — with an AI assistant that answers *from that data*, not from general internet guesswork.

---

## ✨ Features

| Feature | What it does |
|---|---|
| 🌿 **Plant Database** | 35 curated plants (Ayurvedic medicinal + everyday culinary), with live search and multi-select faceted filtering |
| 🤖 **RAG AI Assistant** | Ask anything about medicinal plants — answers are retrieved from the real database via vector embeddings + cosine similarity, then used to ground the AI's response. Not a generic chatbot. |
| 📷 **Plant Identification** | Upload a photo, get species ID via Gemini vision, cross-checked against our own database, with Hindi (Devanagari) names |
| 🩺 **Disease Diagnosis** | Upload a photo of a sick plant — get a structured diagnosis: likely cause, severity, spread risk, and treatment steps |
| ✨ **Personalized Recommendations** | A weighted-scoring questionnaire (climate, space, sunlight, maintenance, goals) that ranks real plants with explainable match reasons |
| 📖 **AI Cultivation Guides** | On-demand, cached, step-by-step growing guides generated per plant — genuinely beginner-oriented, not just static specs |
| 💚 **My Garden** | Save and manage plants you're growing or curious about, tied to a real authenticated account |
| 📊 **Compare Plants** | Side-by-side comparison of care needs, compounds, and safety across up to 4 plants |
| 📍 **Nursery Locator** | Location-aware shortcut into real, live nursery/garden centre results |
| 🇮🇳 **Localization** | Hindi (Devanagari) names surfaced throughout — plant identification, profiles, cards |

---

## 🧠 How the AI actually works

This project deliberately avoids the common shortcut of "wrap an LLM call in a nice UI." Specifically:

**RAG pipeline (AI Assistant):**
```
User question → embedded via Gemini → cosine similarity search
against every plant's stored embedding → top 3 matches retrieved
→ their real data injected into the prompt → Gemini answers using
ONLY that provided context
```
Cosine similarity is implemented manually (`backend/utils/similarity.js`) rather than via a managed vector database — a deliberate, explainable trade-off appropriate at this dataset size (~35 plants).

**Computer vision (Plant ID / Disease Diagnosis):**
Images are sent to Gemini's multimodal API alongside a prompt that defines an exact JSON response contract, which the backend parses into structured UI — not free-form text.

**Honesty as a design principle:** no fabricated user counts, invented citations, or fake testimonials anywhere in this app. Every stat shown is a real, queryable number from the live database.

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas + Mongoose
**AI:** Google Gemini API (`gemini-3.5-flash-lite` for chat/vision, `gemini-embedding-001` for embeddings)
**Auth:** JWT + bcrypt
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

---

## 📁 Project Structure

```
nature-and-nurture/
├── backend/
│   ├── models/         # Mongoose schemas — Plant, User, Activity
│   ├── routes/         # Express route handlers, one file per resource
│   ├── middleware/      # JWT auth verification
│   ├── utils/           # Cosine similarity, shared helpers
│   ├── seed/             # One-time DB population + embedding generation scripts
│   └── server.js
└── frontend/
    └── src/
        ├── app/
        │   ├── (dashboard)/   # Route group: sidebar-layout app pages
        │   ├── plants/[id]/   # Dynamic plant profile route
        │   └── login/
        ├── components/
        ├── context/           # Global auth state (React Context)
        └── utils/
```

---

## 🚀 Running Locally

**Prerequisites:** Node.js 18+, a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster, a free [Google Gemini API key](https://aistudio.google.com/apikey)

```bash
git clone https://github.com/The-AarushiSingh/Nature-and-Nurture.git
cd Nature-and-Nurture
```

**Backend:**
```bash
cd backend
npm install
```
Create `backend/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
```bash
node seed/seedPlants.js          # populate the database
node seed/generateEmbeddings.js  # generate vector embeddings for RAG
npm run dev
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
```
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## 🗺️ Known Limitations & Roadmap

Built solo under a real time constraint — being upfront about scope:

- **OAuth (Google/Apple sign-in)** — UI is present but intentionally not wired up; email/password auth is fully functional
- **Growth timeline / planting log** — designed but not built: a feature to log planting dates and track real growth phases per user, city/climate-aware. A natural next feature.
- **Client-side route protection** — dashboard routes redirect via client-side check, not true server-side middleware
- **Nursery Locator** uses Google Maps deep-linking rather than a self-hosted database, after finding OpenStreetMap's India nursery coverage too sparse to be reliable
- **Dataset** is 35 plants — designed to scale via the same seed/embed pipeline, not a hard architectural limit
- Free-tier hosting (Render) means the backend sleeps after inactivity — first request after idle may take 30–50 seconds to wake up

---

## 📝 License

Built as a personal/academic portfolio project. Not a commercial product.

---

**Built by [Aarushi Singh](https://github.com/The-AarushiSingh)** — a full-stack + AI engineering project, from schema design to deployment.
