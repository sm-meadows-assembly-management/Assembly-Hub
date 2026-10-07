'use client';
import {useEffect,useState} from "react";
export default function Settings(){
 const [p,setP]=useState<any>({events:1,achievements:1,competitions:1,announcements:1}),[saved,setSaved]=useState(false);
 useEffect(()=>{fetch("/api/notifications/preferences").then(r=>r.json()).then(j=>j.data?.preferences&&setP(j.data.preferences))},[]);
 async function save(){await fetch("/api/notifications/preferences",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});setSaved(true);setTimeout(()=>setSaved(false),1500)}
 return <main className="page"><a href="/member">← Member Home</a><h1>Notification Settings</h1>{["events","achievements","competitions","announcements"].map(k=><label className="card" key={k}><input type="checkbox" checked={!!p[k]} onChange={e=>setP({...p,[k]:e.target.checked?1:0})}/> {k[0].toUpperCase()+k.slice(1)} notifications</label>)}<button onClick={save}>Save preferences</button>{saved&&<p>Saved ✓</p>}</main>
}
