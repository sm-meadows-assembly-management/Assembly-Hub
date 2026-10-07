'use client';
import {useEffect,useState} from "react";
export default function Announcements(){
 const [items,setItems]=useState<any[]>([]);
 useEffect(()=>{fetch("/api/announcements").then(r=>r.json()).then(j=>setItems(j.data?.announcements||[]))},[]);
 return <main className="page"><a href="/member">← Member Home</a><p className="eyebrow">Assembly</p><h1>Announcements 📢</h1>{items.map(a=><article className="card" key={a.id}><h2>{a.title}</h2><p>{a.message}</p><small>{a.published_at||a.created_at}</small></article>)}{!items.length&&<p>No announcements yet.</p>}</main>
}
