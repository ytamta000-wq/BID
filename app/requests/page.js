'use client';
import { useEffect, useState } from 'react';

export default function Requests() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  async function load(){const r=await fetch('/api/requests'); const d=await r.json(); if(!r.ok){setError(d.error||'Unable to load');setItems([])}else setItems(d.requests||[]); setLoading(false)}
  useEffect(()=>{load()},[]);
  async function respond(id,status){await fetch('/api/requests/respond',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});load()}
  return <main className="page"><section className="page-title glass"><span className="eyebrow">REQUESTS</span><h1>Connections</h1><p>Only real connection requests from the signed-in account appear here.</p></section>{loading?<div className="empty glass">Loading…</div>:error?<div className="empty glass">{error}</div>:items.length===0?<div className="empty glass"><h2>No connection requests yet</h2><p>Requests will appear after someone actually sends one.</p></div>:<div className="product-grid">{items.map(x=><article className="glass" style={{padding:18}} key={x.id}><h2>{x.requester_id===x.recipient_id?'Connection':x.status}</h2><p>{x.status}</p>{x.status==='pending'&&<div style={{display:'flex',gap:8}}><button className="btn primary" onClick={()=>respond(x.id,'accepted')}>Accept</button><button className="btn ghost" onClick={()=>respond(x.id,'declined')}>Decline</button></div>}</article>)}</div>}</main>;
}
