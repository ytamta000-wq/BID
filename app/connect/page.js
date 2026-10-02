"use client";
import { useState } from "react";
export default function Connect(){
 const [sent,setSent]=useState(false);
 return <main className="page"><section className="page-title glass"><span className="eyebrow">PRIVATE CONNECTIONS</span><h1>Connect safely</h1><p>Requests are required before private chat opens. Direct contact details remain hidden.</p></section><section className="connection-card glass"><div className="avatar">NA</div><div><h2>North Archive</h2><p className="muted">Seller · Vintage & collectibles</p></div><button className="btn primary" onClick={()=>setSent(true)}>{sent?"Request sent":"Request connection"}</button></section><div className="notice">Privacy model: no public phone number or email is shown on listings. A connection can be accepted or rejected before messaging becomes available.</div></main>
}