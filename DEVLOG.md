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
| AI | Google Gemini API (`gemini-3.5-flash-lite` for chat/vision, `gemini-embedding-001` for embeddings) | Free tier covers chat, vision, AND embeddings under one key/SDK — no billing setup needed for a student project. Originally considered OpenAI, switched after confirming OpenAI has no free tier. |

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

## Day 3 — AI Features: RAG Assistant, Disease Diagnosis, Plant Identification

### Choosing an AI provider (a real debugging story worth telling in interviews)

Originally planned around OpenAI, but OpenAI's API has **no free tier** (pay-as-you-go only). Since this is a self-funded student project, switched to **Google Gemini**, which offers free chat, vision, and embeddings under one API key — no credit card required.

This surfaced a genuine lesson in working with fast-moving AI APIs: the first model name tried (`gemini-2.5-flash-lite`) returned a **404 — "no longer available to new users"**, because Google had already moved multiple model generations ahead since any tutorial/documentation snapshot. Instead of guessing at another model name, queried Gemini's own `/models` endpoint programmatically to list every model the API key actually had access to, then picked a **GA (generally available)** model rather than anything marked "preview" — preview models can be deprecated or changed without much warning, GA models are the stable, production-intended choice. Ended up on `gemini-3.5-flash-lite` for chat/vision and `gemini-embedding-001` for embeddings (the older `text-embedding-004` had also been shut down since).

**Interview talking point:** this is a good example of *debugging against a moving target* — AI provider APIs change fast, and the fix wasn't "find the right magic string," it was "query the source of truth (the API itself) instead of trusting possibly-stale documentation/tutorials."

### RAG Assistant — how it actually works

1. **Embedding generation** (`seed/generateEmbeddings.js`): for each plant, combined its key fields (name, description, uses, compounds, care info) into one text blob, sent it to `gemini-embedding-001`, and stored the returned vector (array of numbers representing semantic meaning) directly on that plant's MongoDB document (`embedding: [Number]` field added to schema).
2. **Retrieval** (`routes/assistant.js`, `POST /api/assistant/chat`): when a user asks a question, embed the question the same way, then compare it against every stored plant embedding using **cosine similarity** — a formula measuring the angle between two vectors (1 = identical meaning, 0 = unrelated, -1 = opposite). Implemented this manually (`utils/similarity.js`) rather than using a dedicated vector database, since the dataset is small (~27 plants) — full comparison against every plant is trivially fast at this scale, and manual implementation meant actually understanding the math instead of treating it as a black box.
3. **Augmentation**: took the top 3 highest-scoring plants and pasted their real data directly into the prompt sent to the chat model, with an explicit instruction to answer *only* using that provided data (not general training knowledge) — this is what keeps answers grounded and traceable rather than hallucinated.
4. Returned both the AI's answer **and** which plants were retrieved (`sources` array with similarity scores) — enables the frontend to show clickable citation pills, same pattern as the Figma reference design.

**Why this counts as genuine RAG, not just "call an LLM":** the model never answers purely from memory — every response is conditioned on real, retrieved data from the actual database, and the retrieval step (steps 1-2) is fully separate from and prior to the generation step (step 3). This is the actual architecture RAG refers to, just implemented with manual cosine similarity instead of a managed vector DB (Pinecone, Atlas Vector Search, etc.) — a reasonable scope/complexity trade-off at this dataset size, and one I can defend if asked why I didn't use a "real" vector database.

### Disease Diagnosis & Plant Identification — vision + structured output

Both features follow the same pattern:
- Frontend converts an uploaded image to **base64** via the browser's built-in `FileReader.readAsDataURL()`, strips the `data:image/...;base64,` prefix, and sends the raw base64 string to the backend.
- Backend sends the image to Gemini alongside a text prompt using `generateContent([promptText, { inlineData: { data, mimeType } }])` — passing an **array** instead of a plain string is how Gemini's SDK accepts multiple content types (text + image) in a single multimodal request.
- The prompt explicitly defines an **exact JSON shape** to return (field names, types, allowed enum values like `"Low" | "Moderate" | "High"`), then the backend `JSON.parse()`s the model's response. This is "structured output via prompting" — not a special API feature, just being very explicit about format and defensively stripping markdown code fences (`` ```json ``) in case the model adds them despite instructions.
- **Plant ID adds a database cross-check**: after identification, the backend searches the existing `Plant` collection for a name match (reusing the same `$regex`/case-insensitive pattern from search/filter) and returns `inDatabase: true/false` — so the frontend can link straight to a full curated profile page when there's a match, or show general AI knowledge honestly labeled as such when there isn't.
- **Localization**: added a `hindiName` field to Plant ID's structured output for Indian-audience relevance — a small addition that meaningfully increases the feature's real-world usefulness for the target user base, done by adding one line to the JSON schema in the prompt.

### Scope clarification: not medicinal-only

Mid-build, clarified that the platform was never meant to be strictly medicinal/Ayurvedic — the vision includes everyday culinary/kitchen-garden plants too (basil, cilantro, mint, curry leaf, etc.), aimed at urban users who want fresh herbs on a balcony as much as wellness-focused growers. This required **no schema or code changes** — `category`/`tags` were always generic strings, not a medicinal-only enum — just an expanded seed dataset (15 → 27 plants, mixing Ayurvedic and culinary entries) and a note to soften "medicinal" framing in UI copy during the eventual polish pass. Worth mentioning as an example of schema design flexible enough to absorb a scope change without rework.

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
- What RAG (Retrieval-Augmented Generation) actually means architecturally — retrieval and generation are distinct, sequential steps; the model answers using retrieved data pasted into the prompt, not by "knowing" it natively
- How cosine similarity works and why it's used over raw distance (measures directional/semantic similarity, normalized for text length)
- Why manual cosine similarity (vs. a managed vector DB) was an acceptable choice at this dataset scale, and when it would stop being acceptable (large datasets need indexed vector search — brute-force comparison doesn't scale)
- How multimodal prompts work (`generateContent([text, { inlineData }])`) — sending text and image together in one request
- "Structured output via prompting" — defining an exact JSON contract in the prompt itself vs. relying on a dedicated structured-output API feature
- Why GA (generally available) models were chosen over "preview" models for anything the project depends on long-term

---

## Known gaps / honest talking points for an interview

- Frontend is my comparatively weaker area — I leaned on AI-assisted pair-programming (Claude) to move faster through Next.js/React/Tailwind patterns while learning them in real time, rather than working from memorized syntax. I can explain *why* each pattern was used, even where I needed guidance on exact syntax.
- Route protection is client-side only right now (no server-side middleware blocking unauthenticated API access beyond the JWT-protected routes themselves) — a reasonable scope cut for a 15-day solo project, mentioned proactively rather than hidden.
- UI polish was deliberately deferred to a dedicated pass near the end of the build, prioritizing working features first — a scoping decision, not an oversight.

---

## Status as of Day 3 (of 15-day build)

**All 8 MVP features functionally complete:**
- Plant database + live search/filter (27 plants — medicinal + culinary)
- Plant profile pages (dynamic routing)
- RAG-powered AI Assistant (embeddings + manual vector search + grounded chat)
- Auth (JWT, bcrypt, protected routes)
- My Garden (save/remove, real backend relations)
- Dashboard shell + sidebar layout
- Compare Plants (multi-item dynamic table)
- Disease Diagnosis (Gemini vision + structured JSON output)
- Plant Identification (Gemini vision + DB cross-check + Hindi name)

**Not started yet:**
- Recommendations wizard (questionnaire → personalized plant matches) — was in original scope, deprioritized in favor of the AI vision features; decision pending on whether to build it or cut it from final scope
- Full UI polish pass (planned for near end of build)
- Hindi name field only exists on Plant ID currently — not yet propagated to Plant schema / Disease Diagnosis / RAG assistant (deferred by choice)
- Deployment (Vercel + Atlas)
- README + demo video
- Further dataset expansion (optional, 27 is already a reasonable working size)

---

*This log will be updated as remaining decisions are made — next entry should cover whichever of [Recommendations wizard / UI polish / deployment] gets tackled next, plus final README and demo prep.*