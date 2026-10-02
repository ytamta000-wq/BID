 "use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteShell({children}){
 const path=usePathname();
 return <><header className="topbar"><Link href="/" className="brand"><span>B</span>ID</Link><nav><Link className={path==="/explore"?"nav-active":""} href="/explore">Explore</Link><Link href="/dashboard">Dashboard</Link><Link href="/sell">Sell</Link></nav><Link href="/login" className="login">Login</Link></header>{children}<footer className="footer"><div><b>BID</b><span>Collect. Discover. Bid.</span></div><div><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></footer><div className="bottom-search"><span>⌕</span><input placeholder="Search collectibles, antiques, art..." /><Link href="/explore">Explore</Link></div></>
}