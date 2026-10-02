"use client";
import { useState } from "react";
import Link from "next/link";
function InfinityBG(){return <div className="infinity-bg" aria-hidden="true"><svg viewBox="0 0 800 400"><path d="M80 200 C150 70 285 70 400 200 C515 330 650 330 720 200 C650 70 515 70 400 200 C285 330 150 330 80 200 Z"/><path className="orbit2" d="M120 200 C190 105 300 105 400 200 C500 295 610 295 680 200 C610 105 500 105 400 200 C300 295 190 295 120 200 Z"/></svg></div>}
export default function Login(){
 const [role,setRole]=useState("buyer");
 return <main className="auth-page"><InfinityBG/><section className="auth-card glass"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to BID</h1><div className="role-switch">{["buyer","seller"].map(r=><button key={r} className={role===r?"active":""} onClick={()=>setRole(r)}>{r}</button>)}</div><label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="btn primary wide">Sign in as {role}</button><div className="auth-divider"><span>or continue with</span></div><div className="auth-social"><button className="social-btn google">G&nbsp;&nbsp; Google</button><button className="social-btn apple">●&nbsp;&nbsp; Apple</button></div><p className="center small-copy">New here? <Link href="/signup" className="text-link">Create account</Link></p></section></main>
}