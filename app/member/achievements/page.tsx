'use client';
import {useEffect,useState} from "react";
export default function Achievements(){
 const [items,setItems]=useState<any[]>([]); const [celebrate,setCelebrate]=useState(false);
 useEffect(()=>{if(typeof window!=='undefined'&&new URLSearchParams(location.search).get('celebrate')==='1'){setCelebrate(true);setTimeout(()=>setCelebrate(false),3500)} fetch("/api/member/achievements").then(r=>r.json()).then(j=>setItems(j.data?.achievements||[]))},[]);
 const unlocked=items.filter(a=>a.unlocked).length;
 return <main className="page"><p className="eyebrow">Your Assembly Journey</p><h1>Achievements 🏆</h1><p>{unlocked} / {items.length} unlocked</p>{celebrate&&<section className="card celebration"><div style={{fontSize:56}}>🎉🏆🎉</div><h2>Congratulations!</h2><p>You unlocked an Assembly achievement!</p></section>}
 <div className="stack">{items.map(a=><section className="card" key={a.id} style={{opacity:a.unlocked?1:.5}}>
 <div style={{fontSize:36}}>{a.icon}</div><h2>{a.name}</h2><p>{a.description}</p>{a.unlocked?<small>Unlocked {String(a.awarded_at).slice(0,10)}</small>:<small>🔒 {a.requirement}</small>}
 </section>)}</div></main>
}
