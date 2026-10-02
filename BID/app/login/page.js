"use client";
import { useState } from "react";
import Link from "next/link";
export default function Login(){
 const [role,setRole]=useState("buyer");
 return <main className="auth-page"><section className="auth-card glass"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to BID</h1><div className="role-switch">{["buyer","seller"].map(r=><button key={r} className={role===r?"active":""} onClick={()=>setRole(r)}>{r}</button>)}</div><label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="btn primary wide">Sign in as {role}</button><p className="center muted">New here? <Link href="/signup" className="text-link">Create account</Link></p></section></main>
}