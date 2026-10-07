'use client';
import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";

export default function MembersPage(){
 const router=useRouter(); const [members,setMembers]=useState<any[]>([]); const [q,setQ]=useState(""); const [error,setError]=useState(""); const [editing,setEditing]=useState<any>(null);
 async function load(){const r=await fetch("/api/members");const j=await r.json();if(!r.ok){setError(j.error||"Unable to load members");return}setMembers(j.data.members)}
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(j=>{if(j.user?.role!=="FOUNDER") router.replace("/login"); else load()})},[]);
 const filtered=useMemo(()=>members.filter(m=>(m.display_name+" "+m.username).toLowerCase().includes(q.toLowerCase())),[members,q]);
 async function save(){
   const r=await fetch("/api/members",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(editing)});
   const j=await r.json(); if(!r.ok){setError(j.error);return} setEditing(null);load();
 }
 return <main className="page">
  <a className="back" href="/founder">← Founder Dashboard</a>
  <p className="eyebrow">Founder Control</p><h1>Members 👥</h1>
  <p>Manage Assembly accounts and basic member profiles. Founder accounts are protected.</p>
  {error&&<section className="card"><strong>{error}</strong></section>}
  <input className="input" placeholder="Search members…" value={q} onChange={e=>setQ(e.target.value)}/>
  <div className="stack">{filtered.map(m=><section className="card member-row" key={m.id}>
    <div><strong>{m.display_name}</strong><div>@{m.username} · {m.role}</div><small>Member since {String(m.member_since).slice(0,10)}</small></div>
    <button onClick={()=>setEditing({...m,avatarUrl:m.avatar_url,bio:m.bio})}>Edit</button>
  </section>)}</div>
  {editing&&<div className="modal"><section className="card">
    <h2>Edit {editing.display_name}</h2>
    <label>Name<input className="input" value={editing.display_name} onChange={e=>setEditing({...editing,display_name:e.target.value})}/></label>
    <label>Role<select className="input" value={editing.role} onChange={e=>setEditing({...editing,role:e.target.value})}><option value="MEMBER">Member</option><option value="ORGANIZER">Organizer</option></select></label>
    <label>Bio<textarea className="input" value={editing.bio} onChange={e=>setEditing({...editing,bio:e.target.value})}/></label>
    <label>Avatar URL<input className="input" value={editing.avatarUrl} onChange={e=>setEditing({...editing,avatarUrl:e.target.value})}/></label>
    <div><button onClick={save}>Save changes</button> <button onClick={()=>setEditing(null)}>Cancel</button></div>
  </section></div>}
 </main>
}
