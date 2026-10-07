'use client';
import {useEffect,useState} from "react";
export default function Manage({params}:{params:{id:string}}){
 const [data,setData]=useState<any>(null),[activities,setActivities]=useState<any[]>([]),[selected,setSelected]=useState<string[]>([]),[error,setError]=useState("");
 async function load(){const r=await fetch("/api/events/"+params.id);const j=await r.json();if(!r.ok){setError(j.error);return}setData(j.data);setSelected((j.data.eventActivities||[]).map((x:any)=>x.id));const ar=await fetch("/api/activities");const aj=await ar.json();setActivities(aj.data?.activities||[])}
 useEffect(()=>{load()},[]);
 async function attendance(userId:string,status:string){const r=await fetch("/api/events/"+params.id+"/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,status})});if(!r.ok)setError((await r.json()).error);else load()}
 async function publish(){const r=await fetch("/api/events/"+params.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"PUBLISHED"})});if(!r.ok)setError((await r.json()).error);else load()}
 if(!data)return <main className="page"><a href="/founder/events">← Events</a><p>{error||"Loading…"}</p></main>;
 return <main className="page"><a className="back" href="/founder/events">← Events</a>
 <p className="eyebrow">{data.event.status}</p><h1>{data.event.title}</h1><p>{data.event.description}</p>
 <section className="card"><strong>📅 Schedule</strong><p>{data.event.start_at} → {data.event.end_at||"—"}</p><p>📍 {data.event.location||"Location TBD"}</p>
 {data.event.status!=="PUBLISHED"&&<button onClick={publish}>Publish event</button>}</section>
 <section className="card"><h2>Activities 🎯</h2><p>Select the reusable activities that belong to this event.</p>
<div className="stack">{activities.map((a:any)=><label key={a.id}><input type="checkbox" checked={selected.includes(a.id)} onChange={e=>setSelected(e.target.checked?[...selected,a.id]:selected.filter(id=>id!==a.id))}/> {a.name} <small>({a.category})</small></label>)}</div>
<button onClick={async()=>{const r=await fetch("/api/events/"+params.id+"/activities",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({activityIds:selected})});if(!r.ok)setError((await r.json()).error);else load()}}>Save Activities</button></section>
 <h2>Participants ({data.participants.length})</h2>
 <div className="stack">{data.participants.map((p:any)=><section className="card" key={p.id}>
 <strong>{p.display_name}</strong><div>@{p.username} · {p.status}</div><small>Attendance: {p.attendance}</small>
 <div><button onClick={()=>attendance(p.id,"PRESENT")}>Present</button> <button onClick={()=>attendance(p.id,"LATE")}>Late</button> <button onClick={()=>attendance(p.id,"ABSENT")}>Absent</button></div>
 </section>)}</div>{error&&<p>{error}</p>}</main>
}
