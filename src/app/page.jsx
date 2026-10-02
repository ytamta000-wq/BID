"use client";
import { useState } from "react";
import BackgroundCanvas from "@/components/BackgroundCanvas";

export default function Home() {
  const [currency, setCurrency] = useState("₹");
  const [role, setRole] = useState("buyer");
  const [bids, setBids] = useState([{ id: 1, title: "18th Century Victorian Astro-Compass", currentBid: 680, minBid: 450, bidsCount: 12 }]);

  return (
    <div className="min-h-screen relative p-4 text-slate-100 z-10">
      <BackgroundCanvas />
      <header className="flex justify-between items-center p-4 bg-slate-950/70 border-b border-cyan-500/20 rounded-xl backdrop-blur-md">
        <h1 className="text-xl font-bold text-cyan-400">BID VAULT</h1>
        <div className="flex gap-2">
          <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-slate-900 border border-cyan-500/30 text-xs px-2 py-1 rounded">
            <option>₹</option><option>$</option><option>£</option>
          </select>
          <button onClick={() => setRole(role === "buyer" ? "seller" : "buyer")} className="text-xs bg-cyan-950 border border-cyan-500/30 px-3 py-1 rounded">
            {role.toUpperCase()} MODE
          </button>
        </div>
      </header>

      <main className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {bids.map(b => (
          <div key={b.id} className="p-4 bg-cyan-950/20 border border-cyan-500/20 backdrop-blur-md rounded-2xl">
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-xs text-slate-400 mt-1">18+ Safe Antique Collectible</p>
            <div className="mt-4 p-3 bg-slate-900/80 rounded-xl flex justify-between text-xs">
              <span>High Bid: <strong className="text-cyan-300">{currency}{b.currentBid}</strong></span>
              <span>Total Bids: {b.bidsCount}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}