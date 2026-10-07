'use client';
import {useEffect,useState} from "react";
export default function Announcements(){
 const [items,setItems]=useState<any[]>([]),[title,setTitle]=useState(""),[message,setMessage]=useState(""),[audience,setAudience]=useState("MEMBERS"),[publish,setPublish]=useState(true);
 async function load(){const r=await fetch("/api/announcements");const j=await r.json();setItems(j.data?.announcements||[])}
 useEffect(()=>{load()},[]);
 async function create(){if(!title.trim()||!message.trim())return;await fetch("/api/announcements",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,message,audience,publish})});setTitle("");setMessage("");load()}
 return <main className="page"><a href="/founder">← Founder Dashboard</a><h1>Announcements 📢</h1>
 <section className="card"><h2>Create announcement</h2><input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/><textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} rows={5}/><select value={audience} onChange={e=>setAudience(e.target.value)}><option value="MEMBERS">Members</option><option value="ORGANIZERS">Organizers</option><option value="EVERYONE">Everyone</option><option value="PUBLIC">Public website</option></select><label><input type="checkbox" checked={publish} onChange={e=>setPublish(e.target.checked)}/> Publish now</label><button onClick={create}>Create announcement</button></section>
 <h2>Published</h2>{items.map(a=><article className="card" key={a.id}><strong>{a.title}</strong><p>{a.message}</p><small>{a.audience} · {a.published_at||a.created_at}</small></article>)}</main>
}
