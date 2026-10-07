'use client';
import {useEffect,useState} from "react";
export default function Album({params}:{params:{id:string}}){
 const [a,setA]=useState<any>(null);useEffect(()=>{fetch("/api/gallery/"+params.id).then(r=>r.json()).then(j=>setA(j.data))},[]);
 if(!a)return <main className="page"><p>Loading…</p></main>;
 return <main className="page"><a href="/member/gallery">← Gallery</a><h1>{a.album.title}</h1><p>{a.album.description}</p><div className="gallery-grid">{a.photos.map((p:any)=><figure className="card" key={p.id}><img src={p.url} alt={p.caption||"Assembly photo"} style={{width:"100%",borderRadius:12}}/><figcaption>{p.caption}</figcaption></figure>)}</div></main>
}
