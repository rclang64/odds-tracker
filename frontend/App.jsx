
import React, { useState } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOdds = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/odds");
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error("Error fetching odds:", err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Live Sports Odds</h1>
      <button
        onClick={fetchOdds}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Loading..." : "Refresh Odds"}
      </button>

      {games.length === 0 ? (
        <p>No games loaded. Click "Refresh Odds" to begin.</p>
      ) : (
        games.map((game) => (
          <div key={game.id} className="border rounded-xl p-4 mb-4 shadow">
            <div className="text-xl font-semibold mb-2">{game.matchup}</div>
            <div className="text-sm text-gray-500 mb-2">
              Start Time: {new Date(game.commence_time).toLocaleString()}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.bookmakers.map((book, idx) => (
                <div key={idx} className="border p-2 rounded bg-gray-50">
                  <div className="font-bold text-green-700">{book.site}</div>
                  <div className="text-sm mt-1">
                    <strong>Spread:</strong>{" "}
                    {book.spreads.map(o => \`\${o.name} \${o.point} (\${o.price})\`).join(" | ")}
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Moneyline:</strong>{" "}
                    {book.h2h.map(o => \`\${o.name} (\${o.price})\`).join(" | ")}
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Total:</strong>{" "}
                    {book.totals.map(o => \`\${o.name} \${o.point} (\${o.price})\`).join(" | ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
