'use client';
import {useEffect,useState} from "react";
import {api,AssemblyActivity} from "../../../lib/api-client";
export default function MemberActivities(){const [items,setItems]=useState<AssemblyActivity[]>([]);useEffect(()=>{api.activities().then(setItems).catch(()=>{})},[]);return <main className="page"><a className="back" href="/member">← Member Home</a><p className="eyebrow">Assembly</p><h1>Activities 🎯</h1><p>The shared Assembly activity library.</p><section className="event-list">{items.map(a=><article className="card" key={a.id}><p className="eyebrow">{a.category} · {a.duration}</p><h2>{a.name}</h2><p>{a.description}</p><p><strong>Materials:</strong> {a.materials||"None"}</p></article>)}</section></main>}
