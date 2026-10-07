'use client';
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
export default function Events(){
 const router=useRouter(); const [events,setEvents]=useState<any[]>([]); const [error,setError]=useState("");
 async function load(){const r=await fetch("/api/events");const j=await r.json();if(!r.ok){setError(j.error||"Unable to load");return}setEvents(j.data.events)}
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(j=>{if(!j.user||!["FOUNDER","ORGANIZER"].includes(j.user.role)) router.replace("/login"); else load()})},[]);
 async function remove(id:string){if(!confirm("Delete this event?"))return;const r=await fetch("/api/events/"+id,{method:"DELETE"});if(!r.ok){setError((await r.json()).error);return}load()}
 return <main className="page"><a className="back" href="/founder">← Founder Dashboard</a>
 <p className="eyebrow">Assembly Events</p><h1>Events 📅</h1><a className="button" href="/founder/events/new">+ Create Event</a>
 {error&&<section className="card">{error}</section>}
 <div className="stack">{events.map(e=><section className="card" key={e.id}>
  <div><strong>{e.title}</strong><div>{e.start_at} · {e.location||"Location TBD"}</div><small>{e.status} · {e.participant_count} participant(s)</small></div>
  <div><a className="button" href={"/founder/events/"+e.id}>Manage</a> <button onClick={()=>remove(e.id)}>Delete</button></div>
 </section>)}</div></main>
}
