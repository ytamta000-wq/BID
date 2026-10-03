"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientAuth, setClientAuth } from "../../lib/auth";

const categories = ["Antiques", "Collectibles", "Vintage", "Art", "Memorabilia", "Music", "Books", "Fashion", "Other", "18+ Restricted"];
const conditions = ["New", "Like new", "Good", "Fair", "Poor"];

export default function Sell() {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [converting, setConverting] = useState(false);
  const [files, setFiles] = useState([]);
  const [main, setMain] = useState(0);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Antiques",
    condition: "Good",
    minimumBid: "",
    buyNowPrice: "",
    currency: "USD",
    auctionEndsAt: "",
    discount: "",
  });

  useEffect(() => {
    const local = getClientAuth();
    setAuth(local);
    fetch("/api/profile")
      .then(async (r) => {
        if (!r.ok) return null;
        const data = await r.json();
        return data.profile || null;
      })
      .then((p) => {
        setProfile(p);
        if (p && local) {
          const next = { ...local, role: p.role };
          setClientAuth(next);
          setAuth(next);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach((item) => URL.revokeObjectURL(item.url)), [previews]);

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
    setError("");
    setSuccess(false);
  }

  function onFiles(event) {
    const selected = Array.from(event.target.files || []).slice(0, 6);
    setFiles(selected);
    setMain(0);
    setError("");
  }

  async function becomeSeller() {
    if (converting) return;
    setConverting(true);
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "both" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Seller profile could not be activated.");
      const next = { ...(auth || {}), role: "both" };
      setClientAuth(next);
      setAuth(next);
      setProfile(data.profile || { ...(profile || {}), role: "both" });
    } catch (e) {
      setError(e?.message || "Seller profile could not be activated.");
    } finally {
      setConverting(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (busy || success) return;
    if (!files.length) return setError("Select at least one photo.");
    if (!form.minimumBid || Number(form.minimumBid) < 0) return setError("Enter a valid minimum bid.");
    if (!form.auctionEndsAt) return setError("Choose when the auction ends.");

    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("title", form.title.trim());
    body.set("description", form.description.trim());
    body.set("category", form.category);
    body.set("condition", form.condition);
    body.set("minimumBid", form.minimumBid);
    body.set("buyNowPrice", form.buyNowPrice);
    body.set("currency", form.currency);
    body.set("auctionEndsAt", new Date(form.auctionEndsAt).toISOString());
    body.set("discount", form.discount.trim());
    const ordered = [files[main], ...files.filter((_, index) => index !== main)];
    ordered.forEach((file) => body.append("images", file));

    try {
      const response = await fetch("/api/listings", { method: "POST", body });
      const raw = await response.text();
      let data = {};
      try { data = JSON.parse(raw); } catch { data = { error: raw }; }
      if (!response.ok) throw new Error(data.error || `Publish failed (${response.status})`);
      setSuccess(true);
      setFiles([]);
      setMain(0);
      setForm({ title: "", description: "", category: "Antiques", condition: "Good", minimumBid: "", buyNowPrice: "", currency: "USD", auctionEndsAt: "", discount: "" });
    } catch (e) {
      setError(e?.message || "Could not publish listing.");
    } finally {
      setBusy(false);
    }
  }

  if (loadingProfile) return <main className="bid-v5-page"><div className="bid-v5-loader"><svg className="bid-v5-pyramid" viewBox="0 0 260 260" aria-hidden="true"><g><line x1="130" y1="28" x2="42" y2="205"/><line x1="130" y1="28" x2="218" y2="205"/><line x1="130" y1="28" x2="130" y2="235"/><line x1="42" y1="205" x2="218" y2="205"/><line x1="218" y1="205" x2="130" y2="235"/><line x1="130" y1="235" x2="42" y2="205"/></g></svg><strong>BID</strong><span>Loading seller desk…</span></div></main>;

  if (!auth) return <main className="bid-v5-page"><section className="bid-v5-gate"><span className="bid-v5-eyebrow">SELLER ACCESS</span><h1>Sign in to sell</h1><p>Create and publish auction listings from the seller desk.</p><button className="bid-v5-primary" onClick={() => router.push("/login?next=/sell&role=seller")}>Login</button><button className="bid-v5-secondary" onClick={() => router.push("/signup?role=seller&next=/sell")}>Create account</button></section></main>;

  const sellerActive = auth.role === "seller" || auth.role === "both" || profile?.role === "seller" || profile?.role === "both";
  if (!sellerActive) return <main className="bid-v5-page"><section className="bid-v5-gate"><span className="bid-v5-eyebrow">SELLER PROFILE</span><h1>Become a seller</h1><p>Your buyer profile stays intact. Seller mode is added to the same verified profile, so you can buy and sell without creating a second login.</p><button className="bid-v5-primary" disabled={converting} onClick={becomeSeller}>{converting ? "Activating…" : "Become a seller"}</button>{error && <div className="bid-v5-error">{error}</div>}</section></main>;

  return (
    <main className="bid-v5-page">
      <div className="bid-v5-ambient" aria-hidden="true"><svg className="bid-v5-pyramid" viewBox="0 0 260 260"><g><line x1="130" y1="28" x2="42" y2="205"/><line x1="130" y1="28" x2="218" y2="205"/><line x1="130" y1="28" x2="130" y2="235"/><line x1="42" y1="205" x2="218" y2="205"/><line x1="218" y1="205" x2="130" y2="235"/><line x1="130" y1="235" x2="42" y2="205"/></g></svg><div className="bid-v5-stars"/></div>
      <header className="bid-v5-topbar"><button type="button" onClick={() => router.back()} aria-label="Back">‹</button><div className="bid-v5-tabs"><span>Dashboard</span><strong>Preview</strong></div><button type="button" onClick={() => router.push("/seller")} aria-label="Seller dashboard">↗</button></header>
      <div className="bid-v5-command"><span>↻</span><strong>Create</strong><span>⌄</span><button type="button" onClick={() => router.push("/seller")}>◫</button></div>
      <section className="bid-v5-shell">
        <div className="bid-v5-brand"><div className="bid-v5-brandmark">⚒</div><div><b>BID</b><small>BID MARKETPLACE</small></div><button type="button" onClick={() => router.push("/seller")}>☰</button></div>
        <div className="bid-v5-content">
          <span className="bid-v5-eyebrow">SELLER DESK</span>
          <h1>Create Listing</h1>
          <p className="bid-v5-subtitle">List a rare or unique item for auction.</p>

          <form onSubmit={submit}>
            <label className="bid-v5-label">PHOTOS (UP TO 6)</label>
            <label className="bid-v5-upload">
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onFiles} />
              <span>⇧</span><b>Upload</b><small>Tap to open your gallery</small>
            </label>
            {previews.length > 0 && <div className="bid-v5-photo-grid">{previews.map((item, index) => <button type="button" key={`${item.file.name}-${index}`} className={index === main ? "selected" : ""} onClick={() => setMain(index)}><img src={item.url} alt=""/><span>{index === main ? "MAIN" : index + 1}</span></button>)}</div>}
            <p className="bid-v5-help">Listing photos are stored publicly so all buyers can view them.</p>

            <label className="bid-v5-label" htmlFor="title">TITLE</label>
            <input id="title" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. 19th Century Brass Compass" required />

            <label className="bid-v5-label" htmlFor="description">DESCRIPTION</label>
            <textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the item, its history, condition details..." rows={5} required />

            <div className="bid-v5-two">
              <div><label className="bid-v5-label" htmlFor="category">CATEGORY</label><select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
              <div><label className="bid-v5-label" htmlFor="condition">CONDITION</label><select id="condition" value={form.condition} onChange={(e) => update("condition", e.target.value)}>{conditions.map((item) => <option key={item}>{item}</option>)}</select></div>
            </div>

            <div className="bid-v5-two">
              <div><label className="bid-v5-label" htmlFor="minimumBid">MINIMUM BID ({form.currency === "INR" ? "₹" : form.currency === "GBP" ? "£" : "$"})</label><input id="minimumBid" type="number" min="0" step="0.01" value={form.minimumBid} onChange={(e) => update("minimumBid", e.target.value)} placeholder="50" required /></div>
              <div><label className="bid-v5-label" htmlFor="buyNowPrice">BUY NOW PRICE ({form.currency === "INR" ? "₹" : form.currency === "GBP" ? "£" : "$"})</label><input id="buyNowPrice" type="number" min="0" step="0.01" value={form.buyNowPrice} onChange={(e) => update("buyNowPrice", e.target.value)} placeholder="optional" /></div>
            </div>

            <div className="bid-v5-two bid-v5-currency-row">
              <div><label className="bid-v5-label" htmlFor="currency">CURRENCY</label><select id="currency" value={form.currency} onChange={(e) => update("currency", e.target.value)}><option value="USD">USD $</option><option value="GBP">GBP £</option><option value="INR">INR ₹</option></select></div>
              <div><label className="bid-v5-label" htmlFor="discount">DISCOUNT / OFFER</label><input id="discount" value={form.discount} onChange={(e) => update("discount", e.target.value)} placeholder="optional" /></div>
            </div>

            <label className="bid-v5-label" htmlFor="auctionEndsAt">AUCTION ENDS</label>
            <input id="auctionEndsAt" className="bid-v5-date" type="datetime-local" value={form.auctionEndsAt} onChange={(e) => update("auctionEndsAt", e.target.value)} required />
            <p className="bid-v5-help">On Android, tapping this field opens the native date and time picker.</p>

            {error && <div className="bid-v5-error">{error}</div>}
            {success && <div className="bid-v5-success">Listing published successfully ✓</div>}
            <button className="bid-v5-publish" type="submit" disabled={busy || success}>{success ? "Published ✓" : busy ? "Publishing…" : "Publish Listing"}</button>
            {success && <button className="bid-v5-secondary wide" type="button" onClick={() => setSuccess(false)}>Create another listing</button>}
          </form>
        </div>
      </section>
    </main>
  );
}
