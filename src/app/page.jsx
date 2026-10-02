"use client";
import { useState } from "react";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import { Menu, Search, PlusCircle, User, ShieldCheck, Heart, Clock, MessageSquare, Lock, X, Send, Eye, Sparkles } from "lucide-react";

export default function Home() {
  const [currency, setCurrency] = useState("$");
  const [role, setRole] = useState("buyer");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [chatProduct, setChatProduct] = useState(null);
  const [chatRequested, setChatRequested] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, title: "1782 Royal British Brass Astrolabe Compass", category: "Relics", currentBid: 1250, bidsCount: 18, seller: "ArchivalVault_UK", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", description: "Fully authenticated 18th-century nautical astrolabe.", isAdult: false },
    { id: 2, title: "1898 Imperial Gold Sovereign Coin", category: "Coins", currentBid: 3400, bidsCount: 24, seller: "NumismaticElite", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80", description: "Mint-grade historical gold coin with certified slab encapsulation.", isAdult: false },
    { id: 3, title: "1920s Art Deco Erotic Bronze Figurine", category: "18+ Safe Vintage Relics", currentBid: 1850, bidsCount: 15, seller: "ParisianRelics", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80", description: "Certified historical sensual art piece. Safe and legal 18+ artifact.", isAdult: true },
    { id: 4, title: "1910 Antique Mechanical Pocket Watch", category: "Watches", currentBid: 980, bidsCount: 9, seller: "ChronoCollector", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80", description: "Hand-wound 15-jewel precision movement.", isAdult: false }
  ]);

  const categories = ["All", "Relics", "Coins", "Sculptures", "Watches", "18+ Safe Vintage Relics"];
  const filteredProducts = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

  const formatPrice = (amt) => {
    if (currency === "₹") return `₹${(amt * 83).toLocaleString()}`;
    if (currency === "£") return `£${(amt * 0.79).toFixed(0)}`;
    return `$${amt.toLocaleString()}`;
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const val = Number(bidAmount);
    if (!val || val <= selectedProduct.currentBid) {
      alert(`Bid must be higher than current high bid (${formatPrice(selectedProduct.currentBid)})`);
      return;
    }
    setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, currentBid: val, bidsCount: p.bidsCount + 1 } : p));
    alert("Your bid was successfully placed!");
    setSelectedProduct(null); setBidAmount("");
  };

  return (
    <div className="min-h-screen relative text-slate-100 pb-24 z-10">
      <BackgroundCanvas />
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400"><Menu size={20}/></button>
          <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-200 bg-clip-text text-transparent flex items-center gap-1">
            <Sparkles size={18} className="text-cyan-400"/> BID <span className="text-xs text-cyan-500 font-mono tracking-widest">VAULT</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-1.5 rounded-xl font-mono">
            <option value="$">$ USD</option><option value="£">£ GBP</option><option value="₹">₹ INR</option>
          </select>
          <button onClick={() => setRole(role === "buyer" ? "seller" : "buyer")} className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${role === "seller" ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"}`}>
            {role.toUpperCase()}
          </button>
        </div>
      </nav>

      <div className="flex gap-2 overflow-x-auto p-4 border-b border-slate-900">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border ${activeCategory === cat ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold" : "bg-slate-900/60 border-slate-800 text-slate-400"}`}>
            {cat}
          </button>
        ))}
      </div>

      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full bg-slate-900">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                {p.isAdult && <span className="absolute top-2 right-2 bg-rose-950/90 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 rounded-md font-bold">18+ SAFE RELIC</span>}
              </div>
              <div className="p-4">
                <span className="text-[10px] text-cyan-400 font-mono tracking-wide uppercase">{p.category}</span>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5 line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-4 p-3 bg-slate-900/90 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                  <div><span className="text-slate-500 block text-[10px]">CURRENT HIGH</span><span className="text-cyan-400 font-bold text-sm font-mono">{formatPrice(p.currentBid)}</span></div>
                  <div className="text-right"><span className="text-slate-500 block text-[10px]">TOTAL BIDS</span><span className="text-slate-300 font-medium">{p.bidsCount} offers</span></div>
                </div>
              </div>
            </div>
            <div className="p-4 pt-0 flex gap-2">
              <button onClick={() => { setSelectedProduct(p); setBidAmount(""); }} className="flex-1 py-2.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs rounded-xl font-semibold">Place Bid</button>
              <button onClick={() => { setChatProduct(p); setChatRequested(false); }} className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl"><MessageSquare size={16}/></button>
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 border-t border-cyan-500/20 backdrop-blur-2xl px-6 py-3 flex items-center justify-between max-w-lg mx-auto rounded-t-2xl">
        <button onClick={() => setActiveCategory("All")} className="flex flex-col items-center gap-1 text-cyan-400"><Eye size={18}/><span className="text-[10px]">Vault</span></button>
        {role === "seller" ? (
          <button onClick={() => setSellModalOpen(true)} className="-mt-7 bg-amber-400 text-slate-950 p-3.5 rounded-full border-4 border-slate-950 font-bold"><PlusCircle size={22}/></button>
        ) : (
          <button onClick={() => alert("Search active")} className="flex flex-col items-center gap-1 text-slate-400"><Search size={18}/><span className="text-[10px]">Search</span></button>
        )}
        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 text-slate-400"><User size={18}/><span className="text-[10px]">Account</span></button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-start">
          <div className="w-4/5 max-w-xs bg-slate-950 border-r border-cyan-500/20 h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-4"><h2 className="text-lg font-bold text-cyan-400">Vault Menu</h2><button onClick={() => setSidebarOpen(false)}><X size={20}/></button></div>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3 p-2.5 bg-slate-900/60 rounded-xl"><Heart size={16} className="text-cyan-400"/> Saved Relics</div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-900/60 rounded-xl"><Clock size={16} className="text-cyan-400"/> Bid History</div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-900/60 rounded-xl"><Lock size={16} className="text-amber-400"/> Private Chats</div>
              </div>
              <div className="mt-8 p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-[11px] text-rose-200">
                <div className="flex items-center gap-1.5 font-bold mb-1"><ShieldCheck size={14}/> 18+ Sensual Relic Policy</div> Explicit pornography is strictly banned. Only certified historical adult artifacts allowed.
              </div>
            </div>
            <p className="text-[10px] text-slate-600 text-center">BID VAULT v1.0.0</p>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400"><X size={18}/></button>
            <h3 className="font-bold text-sm text-slate-100">{selectedProduct.title}</h3>
            <p className="text-xs text-cyan-400 mt-1 font-mono">Current High: {formatPrice(selectedProduct.currentBid)}</p>
            <form onSubmit={handlePlaceBid} className="mt-4 space-y-3">
              <input type="number" required value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder={`Higher than ${formatPrice(selectedProduct.currentBid)}`} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none"/>
              <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 rounded-xl font-bold text-xs">Submit High Bid</button>
            </form>
          </div>
        </div>
      )}

      {chatProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 relative">
            <button onClick={() => setChatProduct(null)} className="absolute top-4 right-4 text-slate-400"><X size={18}/></button>
            <h3 className="font-bold text-sm text-slate-100">Private Connect</h3>
            <p className="text-xs text-slate-400 mt-1">Seller: <span className="text-cyan-400 font-mono">{chatProduct.seller}</span></p>
            <div className="mt-4 p-3 bg-slate-900/80 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/80 flex items-start gap-2">
              <Lock size={16} className="shrink-0 mt-0.5 text-amber-400"/> <span>Your phone and email stay hidden until seller approves.</span>
            </div>
            {!chatRequested ? (
              <button onClick={() => setChatRequested(true)} className="mt-4 w-full py-3 bg-cyan-500 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2"><Send size={14}/> Send Request</button>
            ) : (
              <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 text-center">✓ Request Sent!</div>
            )}
          </div>
        </div>
      )}

      {sellModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-amber-500/30 rounded-2xl p-5 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSellModalOpen(false)} className="absolute top-4 right-4 text-slate-400"><X size={18}/></button>
            <h3 className="font-bold text-sm text-amber-400">List New Relic</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const title = e.target.title.value;
              const cat = e.target.category.value;
              const bid = Number(e.target.bid.value);
              const img = e.target.image.value || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600";
              const desc = e.target.desc.value;
              setProducts([{ id: Date.now(), title, category: cat, currentBid: bid, bidsCount: 0, seller: "You (Seller)", image: img, description: desc, isAdult: cat === "18+ Safe Vintage Relics" }, ...products]);
              alert("Published!"); setSellModalOpen(false);
            }} className="mt-4 space-y-3 text-xs">
              <div><label className="text-slate-400 block mb-1">Item Title</label><input name="title" required type="text" placeholder="Title" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100"/></div>
              <div><label className="text-slate-400 block mb-1">Category</label><select name="category" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100">{categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-slate-400 block mb-1">Starting Bid ($)</label><input name="bid" required type="number" placeholder="500" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100"/></div>
              <div><label className="text-slate-400 block mb-1">Image URL</label><input name="image" type="url" placeholder="https://..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100"/></div>
              <div><label className="text-slate-400 block mb-1">Description</label><textarea name="desc" required rows={2} placeholder="Description" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100"/></div>
              <button type="submit" className="w-full py-3 bg-amber-400 text-slate-950 font-bold rounded-xl">Publish Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}