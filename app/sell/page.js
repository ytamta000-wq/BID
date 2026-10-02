"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientAuth } from "../../lib/auth";

const cats = ["Antiques", "Collectibles", "Vintage", "Art", "Memorabilia", "Music", "Books", "Fashion", "Other", "18+ Restricted"];

export default function Sell() {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [files, setFiles] = useState([]);
  const [main, setMain] = useState(0);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setAuth(getClientAuth()), []);

  function onFiles(e) {
    setFiles(Array.from(e.target.files || []).slice(0, 8));
    setMain(0);
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    if (busy || success) return;
    setBusy(true);
    setError("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const ordered = files.length ? [files[main], ...files.filter((_, i) => i !== main)] : [];
    ordered.forEach((file) => form.append("images", file));

    try {
      const res = await fetch("/api/listings", { method: "POST", body: form });
      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw); } catch { data = { error: raw || "Unknown server response" }; }

      if (!res.ok) throw new Error(data.error || `Publish failed (${res.status})`);

      setSuccess(true);
      setFiles([]);
      setMain(0);
      formEl.reset();
    } catch (err) {
      setError(err?.message || "Could not publish listing. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!auth) return <main className="auth-gate page"><section className="glass auth-card center"><span className="eyebrow">SELLER ACCESS</span><h1>Seller login required</h1><p className="small-copy">You need an authenticated seller account before publishing an item.</p><button className="btn primary wide" onClick={() => router.push("/login?next=/sell&role=seller")}>Login as seller</button><button className="btn ghost wide" onClick={() => router.push("/signup?role=seller&next=/sell")}>Create seller account</button></section></main>;

  if (auth.role !== "seller") return <main className="auth-gate page"><section className="glass auth-card center"><span className="eyebrow">SELLER ACCESS</span><h1>Convert to seller account</h1><p className="small-copy">You are signed in as a buyer. Convert this account before creating listings.</p><button className="btn primary wide" onClick={() => router.push("/profile")}>Open profile</button></section></main>;

  return (
    <main className="page">
      <section className="page-title glass">
        <span className="eyebrow">SELLER DESK</span>
        <h1>Publish a listing</h1>
        <p>Set a minimum bid, describe the item accurately and choose the correct category.</p>
      </section>

      <form className="listing-form glass" onSubmit={submit}>
        <label>Item title<input name="title" required placeholder="e.g. Vintage desk clock" /></label>
        <label>Category<select name="category" required defaultValue=""><option value="" disabled>Choose category</option>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
        <div className="two">
          <label>Minimum bid<input name="minimumBid" required type="number" min="0" step="0.01" placeholder="250" /></label>
          <label>Currency<select name="currency" defaultValue="USD"><option value="USD">USD $</option><option value="GBP">GBP £</option><option value="INR">INR ₹</option></select></label>
        </div>
        <label>Images (1–8)<input name="imagePicker" type="file" accept="image/jpeg,image/png,image/webp" multiple required onChange={onFiles} /></label>
        {files.length > 0 && <div className="notice">{files.length} image{files.length > 1 ? "s" : ""} selected. First image is the main image. Tap a filename to make it main.</div>}
        {files.length > 0 && <div className="listing-file-list">{files.map((file, i) => <button type="button" key={`${file.name}-${i}`} className={i === main ? "main-file" : ""} onClick={() => setMain(i)}>{i === main ? "MAIN · " : ""}{file.name}</button>)}</div>}
        <label>Description<textarea name="description" required rows={7} placeholder="Condition, history, included items, shipping information..." /></label>
        <label>Discount / offer<input name="discount" placeholder="Optional" /></label>
        <label className="check"><input type="checkbox" required /> <span>I confirm the listing follows applicable laws, platform rules and category restrictions.</span></label>

        {error && <div className="notice error-notice">{error}</div>}
        {success && <div className="notice success-notice">Listing published successfully.</div>}

        <button className="btn primary" type="submit" disabled={busy || success}>
          {success ? "Published ✓" : busy ? "Publishing…" : "Publish listing"}
        </button>
        {success && <button type="button" className="btn ghost" onClick={() => { setSuccess(false); setError(""); }}>Publish another item</button>}
      </form>
    </main>
  );
}
