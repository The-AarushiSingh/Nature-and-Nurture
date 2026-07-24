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