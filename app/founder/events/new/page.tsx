'use client';
import {FormEvent,useEffect,useState} from "react";
import {api,AssemblyActivity} from "../../../../lib/api-client";

export default function NewEventPage(){
 const [activities,setActivities]=useState<AssemblyActivity[]>([]);
 const [selected,setSelected]=useState<string[]>([]);
 const [saved,setSaved]=useState(false); const [error,setError]=useState("");
 useEffect(()=>{api.activities().then(setActivities).catch(e=>setError(e.message))},[]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setError("");
  const f=new FormData(e.currentTarget);
  try{
   const result=await api.createEvent({
    name:String(f.get("name")||""),description:String(f.get("description")||""),
    date:String(f.get("date")||""),time:String(f.get("time")||""),
    location:String(f.get("location")||""),published:f.get("published")==="on",createdBy:"tuhin"
   });
   setSaved(true);
   e.currentTarget.reset(); setSelected([]);
   // Activity linking will be added to the API in the next refinement; selection is preserved in UI for now.
  }catch(err:any){setError(err.message)}
 }
 return <main className="page">
  <a className="back" href="/founder/events">← Events</a><p className="eyebrow">Founder • Event Builder</p><h1>Create an Event 🎉</h1>
  {saved&&<div className="card success"><strong>Event saved to Assembly's database! 🎉</strong><p>It is now shared server-side.</p></div>}
  {error&&<div className="card"><strong>Something went wrong.</strong><p>{error}</p></div>}
  <form onSubmit={submit} className="card">
   <label>Event name<input name="name" required placeholder="Christmas Celebration"/></label>
   <label>Description<textarea name="description" rows={5}/></label>
   <div className="form-grid"><label>Date<input name="date" type="date" required/></label><label>Time<input name="time" type="time" required/></label></div>
   <label>Location<input name="location" placeholder="Community Hall"/></label>
   <fieldset className="card"><legend><strong>🎯 Activities</strong></legend>{activities.length===0?<p>No activities yet. Add some from the Activities library.</p>:activities.map(a=><label className="check" key={a.id}><input type="checkbox" checked={selected.includes(a.id)} onChange={e=>setSelected(e.target.checked?[...selected,a.id]:selected.filter(x=>x!==a.id))}/>{a.name} <small>({a.category})</small></label>)}</fieldset>
   <label className="check"><input name="published" type="checkbox"/> Publish immediately</label>
   <div className="actions"><button type="submit">💾 Save Event</button></div>
  </form>
 </main>
}
