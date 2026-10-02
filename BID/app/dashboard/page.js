import Link from "next/link";
export default function Dashboard(){
 return <main className="page"><section className="page-title glass"><span className="eyebrow">DASHBOARD</span><h1>Your BID desk</h1><p>Manage your activity, saved listings, bids and private connection requests.</p></section><div className="dashboard-grid">{[
 ["♡","Likes & saves","12 saved listings","/favorites"],
 ["⌁","My bids","7 active bids","/bids"],
 ["＋","Seller listings","3 published items","/sell"],
 ["✦","Connections","4 pending requests","/connect"],
 ["◌","Messages","2 accepted conversations","/messages"],
 ["⚙","Settings","Currency, privacy & account","/settings"]
 ].map(([i,t,s,h])=><Link href={h} className="dash-card glass" key={t}><b className="dash-icon">{i}</b><strong>{t}</strong><span>{s}</span><em>Open →</em></Link>)}</div></main>
}