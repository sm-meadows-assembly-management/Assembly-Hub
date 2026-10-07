'use client';
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "../../../lib/api-client";

const labels:any={"events.view":"View events","events.create":"Create events","events.edit":"Edit events","events.delete":"Delete events","participants.view":"View participants","participants.manage":"Manage participants","activities.view":"View activities","activities.create":"Create activities","activities.edit":"Edit activities","activities.delete":"Delete activities","members.view":"View members","members.edit":"Edit members","achievements.view":"View achievements","achievements.award":"Award achievements","announcements.create":"Create announcements","gallery.manage":"Manage gallery"};

export default function OrganizersPage(){
 const [data,setData]=useState<any>(null);const[error,setError]=useState("");const router=useRouter();
 async function load(){try{const res=await fetch("/api/organizers/permissions");const j=await res.json();if(!res.ok)throw new Error(j.error);setData(j.data)}catch(e:any){setError(e.message)}}
 useEffect(()=>{api.me().then(u=>{if(u.role!=="FOUNDER")router.replace("/login");else load()}).catch(()=>router.replace("/login"))},[]);
 async function toggle(userId:string,permission:string,enabled:boolean){await fetch("/api/organizers/permissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,permission,enabled})});load()}
 return <main className="page"><a className="back" href="/founder">← Founder Dashboard</a><p className="eyebrow">Founder Control</p><h1>Organizer Permissions 🧑‍💼</h1><p>Choose exactly what each Organizer can do. Founder access cannot be granted away or overridden.</p>{error&&<section className="card"><strong>{error}</strong></section>}{data?.organizers?.map((o:any)=><section className="card" key={o.user.id}><h2>{o.user.display_name}</h2><p>@{o.user.username}</p><div className="permission-grid">{data.available.map((p:string)=><label className="check" key={p}><input type="checkbox" checked={!!o.permissions[p]} onChange={e=>toggle(o.user.id,p,e.target.checked)}/>{labels[p]||p}</label>)}</div></section>)}</main>
}
