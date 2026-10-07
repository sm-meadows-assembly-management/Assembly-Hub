'use client';
import {useEffect,useState} from "react";
export default function EventDetail({params}:{params:{id:string}}){
 const [data,setData]=useState<any>(null),[error,setError]=useState("");
 useEffect(()=>{fetch("/api/events/"+params.id).then(r=>r.json()).then(j=>rOk(j)?setData(j.data):setError(j.error));},[]);
 function rOk(j:any){return j?.ok}
 if(!data)return <main className="page"><a href="/member/events">← Events</a><p>{error||"Loading…"}</p></main>;
 return <main className="page"><a href="/member/events">← Events</a><p className="eyebrow">Assembly Event</p><h1>{data.event.title}</h1>
 <p>{data.event.description}</p><section className="card"><strong>📅 When</strong><p>{data.event.start_at} → {data.event.end_at||"—"}</p><strong>📍 Where</strong><p>{data.event.location||"Location TBD"}</p></section>
 <h2>Activities 🎯</h2><div className="stack">{(data.eventActivities||[]).map((a:any)=><section className="card" key={a.id}><strong>{a.name}</strong><div>{a.category} · {a.duration||"Duration not set"}</div><p>{a.description}</p>{a.materials&&<small>Materials: {a.materials}</small>}</section>)}{!data.eventActivities?.length&&<p>No activities have been added yet.</p>}</div>
 <h2>Participants</h2><p>{data.participants.length} member(s) have responded.</p></main>
}
