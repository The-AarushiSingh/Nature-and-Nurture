const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "Location required" });

    const query = `
      [out:json][timeout:15];
      (
        node["shop"="garden_centre"](around:15000,${lat},${lng});
        node["shop"="florist"](around:15000,${lat},${lng});
        node["landuse"="plant_nursery"](around:15000,${lat},${lng});
      );
      out body 20;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });
    const data = await response.json();

    const results = (data.elements || [])
      .filter((el) => el.tags?.name)
      .map((el) => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.shop === "florist" ? "Florist" : "Garden Centre / Nursery",
        lat: el.lat,
        lng: el.lon,
        address: el.tags["addr:street"]
          ? `${el.tags["addr:housenumber"] || ""} ${el.tags["addr:street"]}`.trim()
          : null,
      }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch nearby nurseries." });
  }
});

module.exports = router;