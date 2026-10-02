"use client";
import Link from "next/link";
import {useState} from "react";
export default function ProductCard({product}){
 const [saved,setSaved]=useState(false);
 return <article className="product-card glass"><Link href={`/product/${product.id}`}><img src={product.image} alt={product.title}/></Link><button className="save" aria-label="save" onClick={()=>setSaved(!saved)}>{saved?"♥":"♡"}</button><div className="product-info"><p>{product.category} · {product.seller}</p><h3>{product.title}</h3><div className="bid-row"><div><small>Bid range</small><div className="price-range"><b>${product.min}</b><span>—</span><b>${product.bid}</b></div></div><div><small>Max bid</small><small>{product.bids} bids</small></div></div></div></article>
}