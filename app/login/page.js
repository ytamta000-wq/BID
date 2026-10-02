"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { setClientAuth, strongPassword } from "../../lib/auth";
import { signIn, useSession } from "next-auth/react";

function Triangle(){
  return <div className="triangle-visual" aria-hidden="true"><div className="tri tri-a">△</div><div className="tri tri-b">△</div></div>
}

export default function Login(){
  const router=useRouter();
  const sp=useSearchParams();
  const {status}=useSession();
  const [role,setRole]=useState(sp.get("role")||"buyer");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const next=sp.get("next")||"/";

  useEffect(()=>{if(sp.get("role"))setRole(sp.get("role"))},[sp]);

  useEffect(()=>{
    if(status === "authenticated") router.replace(next);
  },[status,next,router]);

  const submit=e=>{
    e.preventDefault();
    if(!email||pass.length<8){setError("Enter a valid email and a password of at least 8 characters.");return}
    setClientAuth({name:email.split("@")[0],email,role,provider:"password",authenticatedAt:Date.now()});
    router.replace(next);
  };

  const oauth=async(provider)=>{
    if(provider==="Google"){
      setError("");
      setLoading(true);
      const result = await signIn("google",{callbackUrl:next,redirect:false});
      if(result?.error){
        setLoading(false);
        setError("Google sign-in failed. Please try again.");
        return;
      }
      // NextAuth normally redirects itself; the session effect above handles
      // clients that return to this page after the provider callback.
      if(result?.url) window.location.assign(result.url);
    }else{
      setError("Apple login will be connected after Apple OAuth credentials are configured.");
    }
  };

  return <main className="auth-page"><Triangle/><section className="auth-card glass">
    <span className="eyebrow">WELCOME BACK</span><h1>Sign in to BID</h1>
    <div className="role-switch">{["buyer","seller"].map(x=><button type="button" key={x} className={role===x?"active":""} onClick={()=>setRole(x)}>{x}</button>)}</div>
    <form onSubmit={submit}><label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@example.com"/></label><label>Password<input value={pass} onChange={e=>setPass(e.target.value)} type="password" required minLength={8} placeholder="At least 8 characters"/></label><button className="btn primary wide" disabled={loading}>Sign in as {role}</button></form>
    {error&&<div className="notice">{error}</div>}
    <div className="auth-divider"><span>or continue securely with</span></div>
    <div className="auth-social"><button type="button" className="social-btn google" onClick={()=>oauth("Google")} disabled={loading}>{loading?"Connecting…":"G  Google"}</button><button type="button" className="social-btn apple" onClick={()=>oauth("Apple")}>●&nbsp;&nbsp; Apple</button></div>
    <p className="center small-copy">New here? <Link href={`/signup?role=${role}&next=${encodeURIComponent(next)}`} className="text-link">Create account</Link></p>
  </section></main>
}
