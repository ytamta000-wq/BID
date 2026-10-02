"use client";

import { useState } from "react";
import Link from "next/link";

export default function Settings(){
  const [currency,setCurrency]=useState("USD");
  const [visibility,setVisibility]=useState("public");
  const [bid,setBid]=useState(true);
  const [connection,setConnection]=useState(true);

  return <main className="page">
    <section className="page-title glass"><span className="eyebrow">SETTINGS</span><h1>Account & privacy</h1><p>Control your BID marketplace experience.</p></section>
    <section className="settings-list glass">
      <label>Default currency<select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">$ USD</option><option value="INR">₹ INR</option><option value="GBP">£ GBP</option></select></label>
      <label>Profile visibility<select value={visibility} onChange={e=>setVisibility(e.target.value)}><option value="public">Public name only</option><option value="private">Private</option></select></label>
      <label>Bid notifications<select value={bid?"on":"off"} onChange={e=>setBid(e.target.value==="on")}><option value="on">On</option><option value="off">Off</option></select></label>
      <label>Connection notifications<select value={connection?"on":"off"} onChange={e=>setConnection(e.target.value==="on")}><option value="on">On</option><option value="off">Off</option></select></label>
    </section>
    <section className="glass settings-actions"><Link className="btn ghost" href="/profile">View profile</Link><Link className="btn ghost" href="/seller">Seller dashboard</Link><Link className="btn ghost" href="/payments">Payments</Link></section>
  </main>
}
