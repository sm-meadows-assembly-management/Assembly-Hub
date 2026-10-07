'use client';
import {useEffect,useState} from "react";
export default function Activities(){
 const [items,setItems]=useState<any[]>([]),[error,setError]=useState(""); const [form,setForm]=useState<any>({category:"Games"});
 async function load(){const r=await fetch("/api/activities");const j=await r.json();if(!r.ok)setError(j.error);else setItems(j.data.activities)}
 useEffect(()=>{load()},[]);
 async function create(){const r=await fetch("/api/activities",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const j=await r.json();if(!r.ok){setError(j.error);return}setForm({category:"Games"});load()}
 return <main className="page"><a href="/founder">← Founder Dashboard</a><p className="eyebrow">Activity Library</p><h1>Activities 🎯</h1>
 <section className="card"><h2>Create reusable activity</h2><input className="input" placeholder="Activity name" value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/>
 <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Games","Quiz","Creative","Performance","Educational","Outdoor"].map(x=><option key={x}>{x}</option>)}</select>
 <textarea className="input" placeholder="Description" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/>
 <input className="input" placeholder="Duration" value={form.duration||""} onChange={e=>setForm({...form,duration:e.target.value})}/>
 <input className="input" placeholder="Materials" value={form.materials||""} onChange={e=>setForm({...form,materials:e.target.value})}/>
 <button onClick={create}>+ Add Activity</button></section>
 {error&&<p>{error}</p>}<div className="stack">{items.map(a=><section className="card" key={a.id}><h2>{a.name}</h2><div>{a.category} · {a.duration||"Duration not set"}</div><p>{a.description}</p>{a.materials&&<small>Materials: {a.materials}</small>}</section>)}</div></main>
}
