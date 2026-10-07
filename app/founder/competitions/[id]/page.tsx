'use client';
import {useEffect,useState} from "react";
export default function Manage({params}:{params:{id:string}}){
 const [d,setD]=useState<any>(null),[round,setRound]=useState(""),[error,setError]=useState("");
 async function load(){const r=await fetch("/api/competitions/"+params.id);const j=await r.json();if(!r.ok)setError(j.error);else setD(j.data)}
 useEffect(()=>{load()},[]);
 async function addRound(){const r=await fetch("/api/competitions/"+params.id+"/rounds",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:round})});if(!r.ok)setError((await r.json()).error);else{setRound("");load()}}
 async function publish(published:boolean){const r=await fetch("/api/competitions/"+params.id+"/results",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({published})});if(!r.ok)setError((await r.json()).error);else load()}
 async function result(userId:string,position:number){const r=await fetch("/api/competitions/"+params.id+"/results",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,position,published:false})});if(!r.ok)setError((await r.json()).error);else load()}
 if(!d)return <main className="page"><a href="/founder/competitions">← Competitions</a><p>{error||"Loading…"}</p></main>;
 return <main className="page"><a href="/founder/competitions">← Competitions</a><p className="eyebrow">{d.competition.status}</p><h1>{d.competition.name}</h1><p>{d.competition.description}</p>
 <section className="card"><h2>Rounds</h2>{d.rounds.map((r:any)=><div key={r.id}>{r.position+1}. {r.name}</div>)}<input className="input" placeholder="New round" value={round} onChange={e=>setRound(e.target.value)}/><button onClick={addRound}>Add round</button></section>
 <section className="card"><h2>Participants</h2>{d.participants.map((p:any,i:number)=><div key={p.id} className="member-row"><span><strong>{p.display_name}</strong> · {p.status}</span><button onClick={()=>result(p.id,1)}>1st</button><button onClick={()=>result(p.id,2)}>2nd</button><button onClick={()=>result(p.id,3)}>3rd</button></div>)}</section>
 <section className="card"><h2>Results</h2>{d.results.map((r:any)=><div key={r.id}>{r.position?`${r.position}. `:""}{r.display_name} {r.score&&`· ${r.score}`} {r.published?"· Published":"· Draft"}</div>)}<button onClick={()=>publish(true)}>Publish results</button> <button onClick={()=>publish(false)}>Unpublish results</button></section>
 {error&&<p>{error}</p>}</main>
}
