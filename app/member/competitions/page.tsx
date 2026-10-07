'use client';
import {useEffect,useState} from "react";
export default function Competitions(){
 const [items,setItems]=useState<any[]>([]),[msg,setMsg]=useState("");
 useEffect(()=>{fetch("/api/competitions").then(r=>r.json()).then(j=>setItems(j.data?.competitions||[]))},[]);
 async function join(id:string){const r=await fetch("/api/competitions/"+id+"/participants",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});setMsg(r.ok?"You're registered!":(await r.json()).error)}
 return <main className="page"><p className="eyebrow">Assembly</p><h1>Competitions 🏆</h1>{msg&&<section className="card">{msg}</section>}
 <div className="stack">{items.filter(c=>c.status==="PUBLISHED").map(c=><section className="card" key={c.id}><h2>{c.name}</h2><p>{c.description}</p><small>{c.event_title||"Assembly competition"} · {c.participant_count} participant(s)</small><button onClick={()=>join(c.id)}>Join competition</button><a className="button" href={"/member/competitions/"+c.id}>View results</a></section>)}</div></main>
}
