import ProductCard from "../../components/ProductCard";

const products = [
  {id:"1",title:"Vintage Camera Collection",category:"Collectibles",bid:420,min:250,bids:18,seller:"North Archive",image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"},
  {id:"2",title:"Art Deco Desk Clock",category:"Antiques",bid:185,min:120,bids:9,seller:"Old & Found",image:"https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80"},
  {id:"3",title:"Retro Vinyl Set",category:"Music",bid:96,min:60,bids:14,seller:"Groove Vault",image:"https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=900&q=80"},
  {id:"4",title:"Signed Collector Poster",category:"Memorabilia",bid:310,min:200,bids:12,seller:"Paper Moon",image:"https://images.unsplash.com/photo-1561214115-89c43c1d9b89?auto=format&fit=crop&w=900&q=80"},
  {id:"5",title:"Brass Telescope",category:"Antiques",bid:575,min:400,bids:21,seller:"Orbit House",image:"https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=900&q=80"},
  {id:"6",title:"Classic Leather Trunk",category:"Vintage",bid:240,min:150,bids:11,seller:"The Attic",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80"}
];

export default function Explore(){
  return <main className="page">
    <section className="page-title glass">
      <span className="eyebrow">EXPLORE</span><h1>Open marketplace</h1>
      <p>Filter by category, inspect the current bid and save listings for later.</p>
      <div className="chips">{["All","Antiques","Collectibles","Vintage","Memorabilia","Art","Music","18+ Restricted"].map(x=><button key={x} className="chip">{x}</button>)}</div>
    </section>
    <section className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</section>
  </main>
}