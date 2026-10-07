'use client';
import {useEffect,useState} from "react";
export default function MemberEvents(){
 const [events,setEvents]=useState<any[]>([]),[msg,setMsg]=useState("");
 async function load(){const r=await fetch("/api/events");const j=await r.json();setEvents(j.data?.events||[])}
 useEffect(()=>{load()},[]);
 async function register(id:string,status:string){const r=await fetch("/api/events/"+id+"/registrations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});const j=await r.json();setMsg(r.ok?"Your response was saved!":j.error);load()}
 return <main className="page"><p className="eyebrow">Assembly</p><h1>Events 📅</h1>{msg&&<section className="card">{msg}</section>}
 <div className="stack">{events.filter(e=>e.status==="PUBLISHED").map(e=><section className="card" key={e.id}>
 <h2>{e.title}</h2><p>{e.description}</p><div>📅 {e.start_at} · 📍 {e.location||"TBD"}</div><small>{e.participant_count} member(s) joined</small>
 <div><a className="button" href={"/member/events/"+e.id}>View details</a> <button onClick={()=>register(e.id,"GOING")}>Yes, I’m going</button><button onClick={()=>register(e.id,"MAYBE")}>Maybe</button><button onClick={()=>register(e.id,"CANT_ATTEND")}>Can’t attend</button></div>
 </section>)}</div></main>
}
