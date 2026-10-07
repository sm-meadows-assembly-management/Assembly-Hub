'use client';
import {useEffect,useState} from "react";
export default function Album({params}:{params:{id:string}}){
 const [a,setA]=useState<any>(null),[url,setUrl]=useState(""),[caption,setCaption]=useState("");
 async function load(){const r=await fetch("/api/gallery/"+params.id);const j=await r.json();setA(j.data)}
 useEffect(()=>{load()},[]);
 async function add(){if(!url.trim())return;await fetch("/api/gallery/"+params.id,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,caption})});setUrl("");setCaption("");load()}
 if(!a)return <main className="page"><p>Loading…</p></main>;
 return <main className="page"><a href="/founder/gallery">← Gallery</a><h1>{a.album.title}</h1><p>{a.album.description}</p><section className="card"><h2>Add photo</h2><input placeholder="Image URL" value={url} onChange={e=>setUrl(e.target.value)}/><input placeholder="Caption" value={caption} onChange={e=>setCaption(e.target.value)}/><button onClick={add}>Add photo</button><p><small>v2.0 stores image URLs so the app remains ₹0 and does not require a paid image-hosting service.</small></p></section><div className="gallery-grid">{a.photos.map((p:any)=><figure className="card" key={p.id}><img src={p.url} alt={p.caption||"Assembly photo"} style={{width:"100%",borderRadius:12}}/><figcaption>{p.caption}</figcaption></figure>)}</div></main>
}
