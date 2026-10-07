'use client';
import {useEffect,useState} from "react";
export default function Gallery(){
 const [albums,setAlbums]=useState<any[]>([]);
 useEffect(()=>{fetch("/api/gallery").then(r=>r.json()).then(j=>setAlbums(j.data?.albums||[]))},[]);
 return <main className="page"><a href="/member">← Member Home</a><h1>Assembly Gallery 🖼️</h1><p>Photos from Assembly events, shared with members.</p>{albums.map(a=><article className="card" key={a.id}><h2>{a.title}</h2><p>{a.description}</p><a href={"/member/gallery/"+a.id}>View photos →</a></article>)}{!albums.length&&<p>No albums yet.</p>}</main>
}
