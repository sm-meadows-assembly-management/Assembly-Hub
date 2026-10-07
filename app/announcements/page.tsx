'use client';
import {useEffect,useState} from "react";
export default function PublicAnnouncements(){
 const [items,setItems]=useState<any[]>([]);useEffect(()=>{fetch("/api/announcements").then(r=>r.json()).then(j=>setItems((j.data?.announcements||[]).filter((x:any)=>x.audience==="PUBLIC")))},[]);
 return <main className="page"><a href="/">← Assembly</a><h1>Assembly News 📢</h1>{items.map(a=><article className="card" key={a.id}><h2>{a.title}</h2><p>{a.message}</p></article>)}{!items.length&&<p>No public announcements yet.</p>}</main>
}
