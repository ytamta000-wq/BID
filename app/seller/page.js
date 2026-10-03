"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClientAuth, setClientAuth } from "../../lib/auth";

export default function SellerDashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const local = getClientAuth();
    setAuth(local);
    fetch("/api/profile")
      .then(async (r) => r.ok ? (await r.json()).profile : null)
      .then((p) => {
        setProfile(p);
        if (p && local) {
          const next = { ...local, role: p.role };
          setClientAuth(next);
          setAuth(next);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function activate() {
    setActivating(true); setError("");
    try {
      const r = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "both" }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Seller profile could not be activated.");
      const next = { ...(auth || {}), role: "both" };
      setClientAuth(next); setAuth(next); setProfile(data.profile);
    } catch (e) { setError(e?.message || "Could not activate seller mode."); }
    finally { setActivating(false); }
  }

  if (loading) return <main className="bid-v5-page"><div className="bid-v5-loader"><svg className="bid-v5-pyramid" viewBox="0 0 260 260" aria-hidden="true"><g><line x1="130" y1="28" x2="42" y2="205"/><line x1="130" y1="28" x2="218" y2="205"/><line x1="130" y1="28" x2="130" y2="235"/><line x1="42" y1="205" x2="218" y2="205"/><line x1="218" y1="205" x2="130" y2="235"/><line x1="130" y1="235" x2="42" y2="205"/></g></svg><strong>BID</strong><span>Loading seller dashboard…</span></div></main>;
  if (!auth) return <main className="bid-v5-page"><section className="bid-v5-gate"><span className="bid-v5-eyebrow">SELLER</span><h1>Seller dashboard</h1><p>Sign in to manage your listings.</p><Link className="bid-v5-primary link-button" href="/login?next=/seller&role=seller">Sign in</Link></section></main>;
  const seller = auth.role === "seller" || auth.role === "both" || profile?.role === "seller" || profile?.role === "both";
  if (!seller) return <main className="bid-v5-page"><section className="bid-v5-gate"><span className="bid-v5-eyebrow">SELLER PROFILE</span><h1>Activate seller mode</h1><p>Keep the same buyer account and add seller capabilities to it.</p><button className="bid-v5-primary" disabled={activating} onClick={activate}>{activating ? "Activating…" : "Become a seller"}</button>{error && <div className="bid-v5-error">{error}</div>}</section></main>;

  return <main className="bid-v5-page"><div className="bid-v5-ambient" aria-hidden="true"><svg className="bid-v5-pyramid" viewBox="0 0 260 260"><g><line x1="130" y1="28" x2="42" y2="205"/><line x1="130" y1="28" x2="218" y2="205"/><line x1="130" y1="28" x2="130" y2="235"/><line x1="42" y1="205" x2="218" y2="205"/><line x1="218" y1="205" x2="130" y2="235"/><line x1="130" y1="235" x2="42" y2="205"/></g></svg><div className="bid-v5-stars"/></div><header className="bid-v5-topbar"><button type="button" onClick={() => router.push("/")}>‹</button><div className="bid-v5-tabs"><strong>Seller</strong><span>Dashboard</span></div><button type="button" onClick={() => router.push("/settings")}>•••</button></header><section className="bid-v5-shell"><div className="bid-v5-brand"><div className="bid-v5-brandmark">⚒</div><div><b>BID</b><small>SELLER MARKETPLACE</small></div><button type="button" onClick={() => router.push("/sell")}>☰</button></div><div className="bid-v5-content"><span className="bid-v5-eyebrow">SELLER DASHBOARD</span><h1>Manage your listings</h1><p className="bid-v5-subtitle">Create, publish and manage your auctions from one place.</p><div className="bid-v5-dashboard-grid"><Link href="/sell" className="bid-v5-tile"><span>＋</span><b>List an item</b><small>Create a new auction listing.</small></Link><Link href="/dashboard" className="bid-v5-tile"><span>▣</span><b>Your listings</b><small>View bids, status and activity.</small></Link><Link href="/seller/paypal" className="bid-v5-tile"><span>↗</span><b>Payouts</b><small>Connect and manage seller payouts.</small></Link><Link href="/profile" className="bid-v5-tile"><span>◉</span><b>Seller profile</b><small>Update your public seller details.</small></Link></div></div></section></main>;
}
