'use client';
import {useEffect,useState} from "react";
export default function Notifications(){
 const [items,setItems]=useState<any[]>([]),[unread,setUnread]=useState(0);
 async function load(){const r=await fetch("/api/notifications");const j=await r.json();setItems(j.data?.notifications||[]);setUnread(j.data?.unread||0)}
 useEffect(()=>{load()},[]);
 async function read(id:string){await fetch("/api/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});load()}
 async function all(){await fetch("/api/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:true})});load()}
 return <main className="page"><p className="eyebrow">Assembly</p><h1>Notifications 🔔</h1><p>{unread} unread</p>{unread>0&&<button onClick={all}>Mark all as read</button>}
 <div className="stack">{items.map(n=><section className="card" key={n.id} style={{opacity:n.read_at?.5:1}}><div><strong>{n.title}</strong><p>{n.message}</p><small>{n.type} · {String(n.created_at)}</small></div>{!n.read_at&&<button onClick={()=>read(n.id)}>Mark read</button>}</section>)}</div>{!items.length&&<p>No notifications yet. You’re all caught up! ✨</p>}</main>
}
