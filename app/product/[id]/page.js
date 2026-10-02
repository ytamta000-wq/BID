"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const products = {
  "1": {
    title: "Vintage Camera Collection",
    category: "Collectibles",
    bid: 420,
    min: 250,
    bids: 18,
    seller: "North Archive",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    description: "A curated vintage camera listing with seller-provided condition notes and photographs."
  },
  "2": {
    title: "Art Deco Desk Clock",
    category: "Antiques",
    bid: 185,
    min: 120,
    bids: 9,
    seller: "Old & Found",
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=85",
    description: "An Art Deco inspired desk clock offered as a collectible antique listing."
  },
  "3": {
    title: "Retro Vinyl Set",
    category: "Music",
    bid: 96,
    min: 60,
    bids: 14,
    seller: "Groove Vault",
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1200&q=85",
    description: "A retro vinyl collection for music collectors and enthusiasts."
  },
  "4": {
    title: "Signed Collector Poster",
    category: "Memorabilia",
    bid: 310,
    min: 200,
    bids: 12,
    seller: "Paper Moon",
    image: "https://images.unsplash.com/photo-1561214115-89c43c1d9b89?auto=format&fit=crop&w=1200&q=85",
    description: "A signed collector poster presented as a memorabilia auction listing."
  },
  "5": {
    title: "Brass Telescope",
    category: "Antiques",
    bid: 575,
    min: 400,
    bids: 21,
    seller: "Orbit House",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=85",
    description: "A brass telescope with a classic vintage appearance."
  },
  "6": {
    title: "Classic Leather Trunk",
    category: "Vintage",
    bid: 240,
    min: 150,
    bids: 11,
    seller: "The Attic",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
    description: "A classic leather trunk listed for vintage collectors."
  }
};

export default function ProductPage() {
  const { id } = useParams();
  const product = products[id] || products["1"];

  const [bid, setBid] = useState("");
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(product.bid);

  function placeBid(e) {
    e.preventDefault();
    const n = Number(bid);

    if (!n || n <= current) {
      setMessage(`Bid must be higher than $${current}.`);
      return;
    }

    setCurrent(n);
    setBid("");
    setMessage("Bid submitted in demo mode.");
  }

  return (
    <main className="page">
      <Link href="/explore" className="back">
        ← Back to explore
      </Link>

      <section className="detail-grid">
        <div className="product-visual glass">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="glass detail-panel">
          <span className="eyebrow">
            {product.category.toUpperCase()} · AUCTION
          </span>

          <h1>{product.title}</h1>

          <p className="muted">{product.description}</p>

          <div className="bid-metrics">
            <div>
              <small>Minimum bid</small>
              <strong>${product.min}</strong>
            </div>

            <div>
              <small>Highest bid</small>
              <strong>${current}</strong>
            </div>

            <div>
              <small>Bids</small>
              <strong>{product.bids}</strong>
            </div>
          </div>

          <form onSubmit={placeBid} className="bid-form">
            <label>
              Your bid
              <input
                type="number"
                min={current + 1}
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                placeholder={`More than $${current}`}
              />
            </label>

            <button className="btn primary">
              Place bid
            </button>
          </form>

          {message && <div className="notice">{message}</div>}

          <div className="row-actions">
            <button
              className="btn ghost"
              onClick={() => setSaved(!saved)}
            >
              {saved ? "♥ Saved" : "♡ Save"}
            </button>

            <Link className="btn ghost" href="/connect">
              Request connection
            </Link>
          </div>

          <div className="seller-mini">
            <div className="avatar">
              {product.seller.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <b>{product.seller}</b>
              <small>Seller profile · contact hidden</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
