"use client";
import { useState } from "react";
export default function Signup(){
 const [role,setRole]=useState("buyer");
 return <main className="auth-page"><section className="auth-card glass"><span className="eyebrow">CREATE ACCOUNT</span><h1>Join BID</h1><div className="role-switch">{["buyer","seller"].map(r=><button key={r} className={role===r?"active":""} onClick={()=>setRole(r)}>{r}</button>)}</div><label>Display name<input placeholder="Your public name"/></label><label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="Create a password"/></label><label className="check"><input type="checkbox"/> I confirm I meet the age requirement for restricted areas.</label><button className="btn primary wide">Create {role} account</button></section></main>
}