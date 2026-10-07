'use client';
import {useEffect,useState} from "react";
export default function Gallery(){
 const [albums,setAlbums]=useState<any[]>([]),[title,setTitle]=useState(""),[description,setDescription]=useState("");
 async function load(){const r=await fetch("/api/gallery");const j=await r.json();setAlbums(j.data?.albums||[])}
 useEffect(()=>{load()},[]);
 async function create(){if(!title.trim())return;await fetch("/api/gallery",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,description,visibility:"MEMBERS"})});setTitle("");setDescription("");load()}
 return <main className="page"><a href="/founder">← Founder Dashboard</a><h1>Gallery 🖼️</h1><p>Member-only by default. Public visibility is never assumed.</p><section className="card"><input placeholder="Album title" value={title} onChange={e=>setTitle(e.target.value)}/><textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)}/><button onClick={create}>Create album</button></section>{albums.map(a=><article className="card" key={a.id}><h2>{a.title}</h2><p>{a.description}</p><small>{a.photo_count} photos · {a.visibility}</small><div><a href={"/founder/gallery/"+a.id}>Manage album →</a></div></article>)}</main>
}
