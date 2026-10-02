'use client';
import { useState } from 'react';

export default function Sell() {
  const [files, setFiles] = useState([]);
  const [main, setMain] = useState(0);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  function onFiles(e) {
    const next = Array.from(e.target.files || []).slice(0, 8);
    setFiles(next); setMain(0);
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setStatus('Publishing…');
    const form = new FormData(e.currentTarget);
    const ordered = files.length ? [files[main], ...files.filter((_, i) => i !== main)] : [];
    ordered.forEach(file => form.append('images', file));
    try {
      const res = await fetch('/api/listings', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not publish listing');
      setStatus('Listing published successfully.');
      e.currentTarget.reset(); setFiles([]); setMain(0);
    } catch (err) { setStatus(err.message); }
    finally { setBusy(false); }
  }

  return <main className="page"><section className="page-title glass"><span className="eyebrow">SELL</span><h1>List an item</h1><p>Add a main image plus extra images. The first image is the main image.</p></section><form className="glass" style={{padding:20,display:'grid',gap:14}} onSubmit={submit}><input name="title" required placeholder="Item title" /><textarea name="description" required placeholder="Description" rows={6} /><input name="category" placeholder="Category" defaultValue="Other" /><div style={{display:'grid',gap:8}}><label>Minimum bid</label><input name="minimumBid" type="number" min="0" step="0.01" required /><select name="currency" defaultValue="USD"><option>USD</option><option>INR</option><option>GBP</option></select></div><label>Images (1–8)</label><input type="file" accept="image/*" multiple required onChange={onFiles} />{files.length>0&&<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>{files.map((file,i)=><button type="button" key={file.name+i} onClick={()=>setMain(i)} style={{border:i===main?'2px solid #fff':'1px solid #444',padding:4,background:'transparent',color:'#fff'}}><img src={URL.createObjectURL(file)} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'cover'}} /><small>{i===main?'MAIN':'Set main'}</small></button>)}</div>}<button className="btn primary" disabled={busy}>{busy?'Publishing…':'Publish listing'}</button>{status&&<p>{status}</p>}</form></main>;
}
