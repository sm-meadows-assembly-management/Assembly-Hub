'use client';
import {useEffect,useState} from "react";
export default function Competition({params}:{params:{id:string}}){
 const [d,setD]=useState<any>(null);
 useEffect(()=>{fetch("/api/competitions/"+params.id).then(r=>r.json()).then(j=>setD(j.data))},[]);
 if(!d)return <main className="page"><a href="/member/competitions">← Competitions</a><p>Loading…</p></main>;
 return <main className="page"><a href="/member/competitions">← Competitions</a><p className="eyebrow">Competition</p><h1>{d.competition.name}</h1><p>{d.competition.description}</p><h2>Rounds</h2>{d.rounds.map((r:any)=><section className="card" key={r.id}>{r.position+1}. {r.name}</section>)}<h2>Published Results</h2><div className="stack">{d.results.filter((r:any)=>r.published).map((r:any)=><section className="card" key={r.id}><strong>{r.position?`${r.position}. `:""}{r.display_name}</strong>{r.score&&<div>Score: {r.score}</div>}</section>)}{!d.results.some((r:any)=>r.published)&&<p>Results haven't been published yet.</p>}</div></main>
}
