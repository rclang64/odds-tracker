
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3001;

const API_KEY = "e78ff85f4c26c37e18666a5736e5741e";
const SPORT = "basketball_nba";

app.use(cors());

app.get("/api/odds", async (req, res) => {
  try {
    const response = await axios.get(
      \`https://api.the-odds-api.com/v4/sports/\${SPORT}/odds/?regions=us&markets=h2h,spreads,totals&apiKey=\${API_KEY}\`
    );

    const games = response.data.map((game) => ({
      id: game.id,
      matchup: \`\${game.away_team} @ \${game.home_team}\`,
      commence_time: game.commence_time,
      bookmakers: game.bookmakers.map((book) => ({
        site: book.title,
        spreads: book.markets.find(m => m.key === "spreads")?.outcomes || [],
        h2h: book.markets.find(m => m.key === "h2h")?.outcomes || [],
        totals: book.markets.find(m => m.key === "totals")?.outcomes || [],
      })),
    }));

    res.json(games);
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));
