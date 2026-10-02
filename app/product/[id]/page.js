"use client";
import { useState } from "react";
import Link from "next/link";

export default function ProductPage(){
  const [bid,setBid]=useState("");
  const [saved,setSaved]=useState(false);
  const [message,setMessage]=useState("");
  const [current,setCurrent]=useState(420);
  function placeBid(e){
    e.preventDefault();
    const n=Number(bid);
    if(n<=current){setMessage(`Bid must be higher than $${current}.`);return;}
    setCurrent(n); setBid(""); setMessage("Bid submitted in demo mode.");
  }
  return <main className="page">
    <Link href="/explore" className="back">← Back to explore</Link>
    <section className="detail-grid">
      <div className="product-visual glass"><img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85" alt="Vintage camera"/></div>
      <div className="glass detail-panel">
        <span className="eyebrow">COLLECTIBLES · AUCTION</span>
        <h1>Vintage Camera Collection</h1>
        <p className="muted">A curated vintage camera listing with seller-provided condition notes and photographs.</p>
        <div className="bid-metrics"><div><small>Minimum bid</small><strong>$250</strong></div><div><small>Max bid</small><strong>${current}</strong></div><div><small>Bids</small><strong>19</strong></div></div>
        <form onSubmit={placeBid} className="bid-form"><label>Your bid<input type="number" min={current+1} value={bid} onChange={e=>setBid(e.target.value)} placeholder={`More than $${current}`}/></label><button className="btn primary">Place bid</button></form>
        {message && <div className="notice">{message}</div>}
        <div className="row-actions"><button className="btn ghost" onClick={()=>setSaved(!saved)}>{saved?"♥ Saved":"♡ Save"}</button><Link className="btn ghost" href="/connect">Request connection</Link></div>
        <div className="seller-mini"><div className="avatar">NA</div><div><b>North Archive</b><small>Seller profile · contact hidden</small></div></div>
      </div>
    </section>
  </main>
}