'use client';
import {useEffect,useState} from "react";
export default function Competitions(){
 const [items,setItems]=useState<any[]>([]),[events,setEvents]=useState<any[]>([]),[form,setForm]=useState<any>({}),[error,setError]=useState("");
 async function load(){const [a,b]=await Promise.all([fetch("/api/competitions"),fetch("/api/events")]);const aj=await a.json(),bj=await b.json();setItems(aj.data?.competitions||[]);setEvents(bj.data?.events||[])}
 useEffect(()=>{load()},[]);
 async function create(){const r=await fetch("/api/competitions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const j=await r.json();if(!r.ok){setError(j.error);return}setForm({});load()}
 return <main className="page"><a href="/founder">← Founder Dashboard</a><p className="eyebrow">Competition Management</p><h1>Competitions 🏆</h1>
 <section className="card"><h2>Create competition</h2><input className="input" placeholder="Competition name" value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/>
 <select className="input" value={form.eventId||""} onChange={e=>setForm({...form,eventId:e.target.value})}><option value="">No event</option>{events.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}</select>
 <textarea className="input" placeholder="Description" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/><button onClick={create}>+ Create Competition</button></section>
 {error&&<p>{error}</p>}<div className="stack">{items.map(c=><section className="card" key={c.id}><h2>{c.name}</h2><div>{c.status} · {c.participant_count} participant(s)</div>{c.event_title&&<small>Event: {c.event_title}</small>}<p>{c.description}</p><a className="button" href={"/founder/competitions/"+c.id}>Manage</a></section>)}</div></main>
}
