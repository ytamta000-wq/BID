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

  useEffect(() => {
    const localAuth = getClientAuth();

    if (localAuth) {
      setAuth(localAuth);
      return;
    }

    if (status === "authenticated" && session?.user) {
      const googleAuth = {
        name: session.user.name || session.user.email?.split("@")[0] || "User",
        email: session.user.email || "",
        role: "buyer",
        provider: "google",
        authenticatedAt: Date.now(),
      };

      setClientAuth(googleAuth);
      setAuth(googleAuth);
    } else if (status === "unauthenticated") {
      setAuth(null);
    }
  }, [path, status, session]);

  const logout = async () => {
    clearClientAuth();
    setAuth(null);

    if (session) {
      await signOut({ redirect: false });
    }

    router.push("/");
  };

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          <span>B</span>ID
        </Link>

        <nav>
          <Link
            className={path === "/explore" ? "nav-active" : ""}
            href="/explore"
          >
            Explore
          </Link>

          <Link href="/dashboard">Dashboard</Link>
          <Link href="/sell">Sell</Link>
        </nav>

        <div className="nav-auth">
          {auth ? (
            <>
              <span className="nav-user">{auth.name || auth.email}</span>
              <button className="login" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="login">
                Login
              </Link>
              <Link href="/signup" className="signup-nav">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {children}

      <footer className="footer">
        <div>
          <b>BID</b>
          <span>Collect. Discover. Bid.</span>
        </div>

        <div>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>

      <div className="bottom-search">
        <span>⌕</span>
        <input placeholder="Search collectibles, antiques, art..." />
        <Link href="/explore">Explore</Link>
      </div>
    </>
  );
}
