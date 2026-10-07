import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";
import {randomUUID} from "crypto";
import {audit} from "./../../../lib/audit";

export const runtime="nodejs";

async function allowed(permission:string){
 const u=await currentUser(); if(!u) return {u:null,ok:false};
 if(u.role==="FOUNDER") return {u,ok:true};
 if(u.role==="ORGANIZER") return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}

export async function GET(){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const events=db.prepare(`SELECT e.*,
   (SELECT COUNT(*) FROM event_registrations r WHERE r.event_id=e.id) participant_count
   FROM events e WHERE e.status='PUBLISHED' OR ?='FOUNDER' OR ?='ORGANIZER' ORDER BY e.start_at ASC`).all(u.role,u.role);
 return NextResponse.json({ok:true,data:{events}});
}

export async function POST(req:Request){
 const {u,ok}=await allowed("events.create");
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Event creation permission required"},{status:403});
 const b=await req.json().catch(()=>null);
 if(!b?.title || !b?.startAt) return NextResponse.json({ok:false,error:"Title and start time are required"},{status:400});
 initializeDatabase();
 const id=randomUUID();
 db.prepare(`INSERT INTO events(id,title,description,start_at,end_at,location,status)
 VALUES(?,?,?,?,?,?,?)`).run(id,String(b.title),String(b.description||""),String(b.startAt),String(b.endAt||""),String(b.location||""),b.publish?"PUBLISHED":"DRAFT");
 audit(u.id,"CREATE","EVENT",id); return NextResponse.json({ok:true,data:{id}},{status:201});
}
