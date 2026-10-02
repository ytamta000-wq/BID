"use client";
export function TriangleFX(){return <div className="triangle-fx" aria-hidden="true"><div className="pyramid"><span/><span/><span/></div></div>}
export function WelcomeLoader({children}){return <div className="welcome-loader"><TriangleFX/><div className="welcome-word">B<span>ID</span></div>{children}</div>}
