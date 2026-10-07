import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../../lib/server-db";
import {currentUser} from "./../../../../../lib/require-user";
import {hasPermission} from "./../../../../../lib/permissions";

export const runtime="nodejs";
async function staff(){
 const u=await currentUser(); if(!u) return {u:null,ok:false};
 if(u.role==="FOUNDER") return {u,ok:true};
 if(u.role==="ORGANIZER") return {u,ok:await hasPermission("activities.edit")};
 return {u,ok:false};
}
export async function GET(_:Request,{params}:{params:{id:string}}){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const activities=db.prepare(`SELECT a.*,ea.position FROM event_activities ea JOIN activities a ON a.id=ea.activity_id
 WHERE ea.event_id=? ORDER BY ea.position,a.name COLLATE NOCASE`).all(params.id);
 return NextResponse.json({ok:true,data:{activities}});
}
export async function POST(req:Request,{params}:{params:{id:string}}){
 const {u,ok}=await staff(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Activity edit permission required"},{status:403});
 const b=await req.json().catch(()=>null); const ids=Array.isArray(b?.activityIds)?b.activityIds:[];
 initializeDatabase();
 const tx=db.transaction(()=>{
   db.prepare("DELETE FROM event_activities WHERE event_id=?").run(params.id);
   const stmt=db.prepare("INSERT INTO event_activities(event_id,activity_id,position) VALUES(?,?,?)");
   ids.forEach((id:string,i:number)=>stmt.run(params.id,id,i));
 });
 tx();
 return NextResponse.json({ok:true});
}
