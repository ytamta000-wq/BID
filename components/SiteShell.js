"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearClientAuth, getClientAuth, setClientAuth } from "../lib/auth";
import { useSession, signOut } from "next-auth/react";

export default function SiteShell({ children }) {
  const path = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function sync() {
      const local = getClientAuth();
      if (status === "authenticated" && session?.user) {
        let role = local?.role || "buyer";
        try {
          const r = await fetch("/api/profile");
          if (r.ok) {
            const data = await r.json();
            role = data.profile?.role || role;
          }
        } catch {}
        const next = { name: session.user.name || session.user.email?.split("@")[0] || "User", email: session.user.email || "", role, provider: "google", authenticatedAt: Date.now() };
        if (!cancelled) { setClientAuth(next); setAuth(next); }
        return;
      }
      if (status === "unauthenticated" && !cancelled) setAuth(local || null);
    }
    if (status !== "loading") sync();
    return () => { cancelled = true; };
  }, [status, session]);

  useEffect(() => setMenu(false), [path]);

  const seller = auth?.role === "seller" || auth?.role === "both";
  const logout = async () => {
    clearClientAuth(); setAuth(null);
    if (status === "authenticated") await signOut({ redirect: false });
    router.replace("/");
  };

  return <>
    <header className="topbar">
      <button className="mobile-menu-btn" type="button" onClick={() => setMenu(true)} aria-label="Open menu">☰</button>
      <Link href="/" className="brand"><span>B</span>ID</Link>
      <nav className="desktop-nav"><Link className={path === "/explore" ? "nav-active" : ""} href="/explore">Explore</Link><Link className={path === "/dashboard" ? "nav-active" : ""} href="/dashboard">Dashboard</Link><Link className={path === "/sell" ? "nav-active" : ""} href="/sell">{seller ? "List Item" : "Sell"}</Link>{seller && <Link className={path === "/seller" ? "nav-active" : ""} href="/seller">Seller</Link>}</nav>
      <div className="nav-auth">{auth ? <><Link href="/profile" className="nav-user">{auth.name || auth.email}</Link><button className="login" onClick={logout}>Logout</button></> : <><Link href="/login" className="login">Login</Link><Link href="/signup" className="signup-nav">Sign up</Link></>}</div>
    </header>
    {menu && <div className="sidebar-overlay" onClick={() => setMenu(false)}><aside className="mobile-sidebar" onClick={(e) => e.stopPropagation()}><div className="sidebar-head"><Link href="/" className="brand"><span>B</span>ID</Link><button type="button" onClick={() => setMenu(false)}>×</button></div><div className="sidebar-links"><Link href="/">⌂ Home</Link><Link href="/explore">⌕ Explore</Link><Link href="/dashboard">▣ Dashboard</Link>{seller ? <><Link href="/seller">◈ Seller Dashboard</Link><Link href="/sell">＋ List Item</Link></> : <Link href="/sell">＋ Become a Seller</Link>}<Link href="/profile">◉ Profile</Link><Link href="/settings">⚙ Settings</Link></div><div className="sidebar-divider"/><Link href="/requests">Requests</Link><Link href="/messages">Messages</Link><Link href="/orders">Orders</Link>{auth ? <button className="sidebar-logout" onClick={logout}>Logout</button> : <Link className="sidebar-login" href="/login">Login</Link>}</aside></div>}
    {children}
    <footer className="footer"><div><b>BID</b><span>Collect. Discover. Bid.</span></div><div><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></footer>
    <div className="bottom-search"><span>⌕</span><input placeholder="Search collectibles, antiques, art..."/><Link href="/explore">Explore</Link></div>
  </>;
}
