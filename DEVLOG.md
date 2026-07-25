What is seed/ for?
"Seeding" a database is a common term for pre-filling it with starter data so you're not starting from a completely empty app. Think of it like "planting seeds" (fitting name for your project) — you run it once, and your database goes from empty to populated. The seed folder is just a convention — a dedicated place to keep these one-time data-loading scripts, separate from your actual app logic (models/, routes/). It's not a special Express/Mongoose concept — it's literally just a folder we made up to stay organized.

What is seedPlants.js for, specifically?
It's a small standalone script (not part of your running server) that:

Connects to your MongoDB
Deletes whatever's currently in the plants collection (so re-running it doesn't create duplicates)
Inserts a batch of plant objects in one go
Exits

You run it manually whenever you want to reset/refill your data — it's not something that runs automatically when your server starts.

Do you need to hardcode all the plant data?
For 30-50 plants — yes, largely, because there's no free/reliable API that gives you rich, structured Ayurvedic medicinal plant data (uses, care guide, compounds, etc.) in the exact shape your app needs. This is genuinely normal for niche-domain projects — you (or I, helping you) will compile it from research/reference sources into this JSON format. It's tedious but one-time. I can generate you batches of 10-15 well-researched plants at a time so you're not writing each one from scratch.

----------------------------------------------------------------------------------------------------------
# Nature & Nurture — Development Log

**Project:** AI-powered medicinal plant discovery & cultivation platform
**Purpose of this doc:** Running technical log of what was built, why, and the concepts behind it — written for interview prep and resume reference, especially for frontend concepts I'm less confident explaining on the spot.

---

## Tech Stack & Why

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4 | Industry-standard React framework; App Router gives file-based routing + built-in client/server component model |
| Backend | Node.js + Express | Lightweight, unopinionated, fast to stand up REST APIs |
| Database | MongoDB Atlas (cloud, free tier) | Flexible schema fits varied plant data (nested care guides, arrays of tags/compounds); Mongoose adds structure on top |
| Auth | JWT (JSON Web Tokens) + bcrypt | Stateless auth — no server-side session storage needed; industry standard for API-driven apps |
| Planned: AI | OpenAI API (chat + vision + embeddings) | Powers RAG assistant, plant ID, disease diagnosis |

**Repo structure:**
```
nature-and-nurture/
├── backend/
│   ├── models/       → Mongoose schemas (Plant.js, User.js)
│   ├── routes/       → Express route handlers (plants.js, auth.js, garden.js)
│   ├── middleware/   → auth.js (JWT verification)
│   ├── seed/         → seedPlants.js (one-time DB population script)
│   └── server.js     → entry point, connects DB + mounts routes
└── frontend/
    └── src/
        ├── app/              → Next.js App Router pages
        │   ├── (dashboard)/  → route group: sidebar-layout pages (dashboard, garden, compare)
        │   ├── plants/[id]/  → dynamic plant profile route
        │   └── login/        → auth page (tabbed sign in/up)
        ├── components/       → Navbar.js, Sidebar.js
        └── context/          → AuthContext.js (global auth state)
```

---

## Day 1 — Backend Foundation

### What was built
1. Express server (`server.js`) with CORS + JSON middleware
2. MongoDB Atlas cluster (free M0 tier) + connection via Mongoose
3. `Plant` schema — nested structure: top-level fields (commonName, botanicalName, family, tags, etc.) plus a nested `careGuide` sub-object (sunlight, water, soil, difficulty, etc.)
4. REST API for plants: `GET /api/plants` (list, with query support), `GET /api/plants/:id` (single), `POST /api/plants` (create)
5. A **seed script** (`seed/seedPlants.js`) — populates the DB with 15 real, researched medicinal plants in one run instead of manual entry via Postman
6. Manual testing via Postman for every route before touching the frontend

### Key concepts (interview-ready explanations)

**Why a seed script instead of manual data entry?**
A seed script is a standalone Node script (not part of the running server) that connects to the DB, wipes existing data, and bulk-inserts a defined dataset. It's idempotent — re-running it always produces a known, clean state, which is valuable both for development (reset your data instantly) and demos (guaranteed consistent state before showing the app).

**Why Mongoose over raw MongoDB driver?**
Mongoose adds a **schema layer** on top of MongoDB's naturally schema-less documents — it validates data shape before saving (e.g., `required: true` fields, enforced types) and gives convenience methods (`.find()`, `.findById()`, `.populate()`) instead of writing raw MongoDB query syntax everywhere.

**Why nest `careGuide` as a sub-object instead of flat fields?**
Groups logically related data (sunlight/water/soil/difficulty) together, mirrors how the UI actually displays it (as a "Care Guide" card), and allows dot-notation querying (`careGuide.difficulty`) without polluting the top-level document with a dozen loosely related fields.

**MVC-adjacent structure:** `models/` (data shape) → `routes/` (request handling logic) → `server.js` (wiring). Not strict MVC (no separate "controllers" folder — route handlers double as controllers here), but same separation-of-concerns principle: one file per resource, each layer only knows about the layer directly below it.

---

## Day 2 — Frontend Foundation, Auth, and Feature Buildout

### What was built

**1. Next.js + Tailwind v4 setup**
- Used Tailwind v4, which replaced the old `tailwind.config.js` JS-based config with an `@theme` block directly inside CSS (`globals.css`). Custom design tokens (`--color-primary`, `--color-cream`, etc.) defined once, auto-generate matching utility classes (`bg-primary`, `text-primary`).

**2. Plant browsing + dynamic routing**
- Homepage (`app/page.js`): fetches `/api/plants`, renders as a responsive card grid (Tailwind's `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` responsive pattern)
- Plant profile page (`app/plants/[id]/page.js`): Next.js **dynamic route** — a folder literally named `[id]` becomes a URL parameter. `useParams()` hook reads it; that value feeds into `fetch(/api/plants/${id})`.
- Live **search + filters**: backend route accepts query params (`?search=&difficulty=&category=`), builds a MongoDB query object conditionally (`$regex` + `$options: "i"` for case-insensitive partial text match, `$or` across multiple fields). Frontend uses `URLSearchParams` to build the query string and a `useEffect` with `[search, difficulty, category]` as dependencies — any change to these triggers a refetch automatically ("search-as-you-type" pattern, no submit button).

**3. Authentication (JWT-based)**
- **Backend:** `POST /api/auth/register` and `/login`. Passwords hashed with `bcrypt.hash(password, 10)` before storage — never stored in plain text, and hashing is one-way (can't be reversed, only compared: `bcrypt.compare()`). On success, `jsonwebtoken.sign({ userId }, SECRET, { expiresIn: "7d" })` issues a signed token.
- **Middleware pattern:** `middleware/auth.js` — a function that intercepts a request *before* the route handler runs, checks for a valid `Authorization: Bearer <token>` header, verifies it with `jwt.verify()`, and attaches the decoded user ID to `req.userId`. Passed as a second argument to any route needing auth: `router.get("/", requireAuth, async (req, res) => {...})`. This is the standard Express middleware chaining pattern.
- **Frontend:** React **Context API** (`AuthContext.js`) — a global "shared box" of state (`user`, `token`) accessible from any component via a custom `useAuth()` hook, without prop-drilling. Token + user persisted to `localStorage` so login survives page refresh; restored via a `useEffect` on app load.
- **Protected routes:** pages like `/dashboard` and `/garden` check `if (!loading && !user) router.push("/login")` inside a `useEffect` — a client-side redirect guard (not true server-side route protection, but sufficient for this project's scope — worth mentioning as a known limitation if asked).

**4. My Garden (save/remove plants)**
- Relational-style modeling in a NoSQL DB: `User.savedPlants` stores an **array of ObjectId references** to `Plant` documents (`ref: "Plant"`), not full copies. Mongoose's `.populate("savedPlants")` then auto-fetches the full plant documents for those IDs in one call — mirrors a SQL join conceptually, without needing actual joins.
- Full CRUD-style routes: `GET /api/garden` (list saved, populated), `POST /api/garden/:plantId` (save), `DELETE /api/garden/:plantId` (remove) — all behind the `requireAuth` middleware.
- Frontend: optimistic-ish UI update on remove (`setPlants(prev => prev.filter(...))`) so the list updates instantly without waiting for a refetch.

**5. Dashboard + Sidebar layout**
- Next.js **route groups**: a folder named `(dashboard)` (parentheses) applies a shared layout (`layout.js` with the sidebar) to every page inside it, *without* adding `/dashboard/` to the actual URL. Purely organizational — a Next.js-specific convention worth knowing cold.
- Dashboard stats are a mix of **real data** (Plants Saved, pulled live from `/api/garden`) and **explicit placeholders** ("—" / "Coming soon") for stats that depend on features not yet built (AI Queries, Plants ID'd, Streak) — an intentional choice to avoid shipping fake numbers.

**6. Compare Plants**
- No new backend needed — reused existing `/api/plants` and `/api/plants/:id`.
- Frontend-only feature: dropdown to add plants (filtered to exclude already-selected ones via `.some()`), stored in local `selectedPlants` state (max 4).
- Comparison table built from a **config-driven row list** — an array of `{ label, getValue: (plant) => ... }` objects, then `.map()`'d into `<tr>` rows. Avoids writing ~11 near-identical JSX blocks by hand; a genuinely reusable pattern for any "compare N objects across M attributes" UI.

---

## Concepts I should be able to explain confidently in an interview

- Difference between `useState` and Context API (local component state vs. shared/global state)
- Why JWT is "stateless" compared to session-based auth (no server-side session store; the token itself carries the claim, verified via signature)
- What middleware means in Express and how `next()` works
- Mongoose `populate()` vs. manually joining data
- Dynamic routes (`[id]`) vs. route groups (`(group)`) in Next.js App Router — different bracket types, different purposes
- Why passwords are hashed, not encrypted (one-way vs. two-way — encryption is reversible with a key, hashing isn't reversible at all)
- Tailwind v4's CSS-based `@theme` config vs. v3's JS config file
- Trade-off made: client-side route protection (`useEffect` redirect) vs. true server-side protection — acceptable for this project's scope, but I know the limitation

---

## Known gaps / honest talking points for an interview

- Frontend is my comparatively weaker area — I leaned on AI-assisted pair-programming (Claude) to move faster through Next.js/React/Tailwind patterns while learning them in real time, rather than working from memorized syntax. I can explain *why* each pattern was used, even where I needed guidance on exact syntax.
- Route protection is client-side only right now (no server-side middleware blocking unauthenticated API access beyond the JWT-protected routes themselves) — a reasonable scope cut for a 15-day solo project, mentioned proactively rather than hidden.
- UI polish was deliberately deferred to a dedicated pass near the end of the build, prioritizing working features first — a scoping decision, not an oversight.

---

## Status as of Day 2 (of 15-day build)

**Done:**
- Plant database + live search/filter
- Plant profile pages (dynamic routing)
- Auth (JWT, bcrypt, protected routes)
- My Garden (save/remove, real backend relations)
- Dashboard shell + sidebar layout
- Compare Plants (multi-item dynamic table)

**Not started yet:**
- RAG AI Assistant (embeddings + vector search + chat UI) — centerpiece feature
- Plant Identification (OpenAI vision)
- Disease Diagnosis (OpenAI vision)
- Full UI polish pass (planned for near end of build)
- Dataset expansion beyond 15 plants

---

*This log will be updated as each remaining feature is built — next entry should cover the RAG pipeline (embeddings, vector search, and how retrieval grounds the LLM's responses).*