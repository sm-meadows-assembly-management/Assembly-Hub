import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";
import {randomUUID} from "crypto";

export const runtime="nodejs";
async function access(permission:string){
 const u=await currentUser(); if(!u)return {u:null,ok:false};
 if(u.role==="FOUNDER")return {u,ok:true};
 if(u.role==="ORGANIZER")return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}
export async function GET(){
 const u=await currentUser(); if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const rows=db.prepare(`SELECT c.*,e.title event_title,
 (SELECT COUNT(*) FROM competition_participants cp WHERE cp.competition_id=c.id) participant_count
 FROM competitions c LEFT JOIN events e ON e.id=c.event_id ORDER BY c.created_at DESC`).all();
 return NextResponse.json({ok:true,data:{competitions:rows}});
}
export async function POST(req:Request){
 const {u,ok}=await access("competitions.create");
 if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok)return NextResponse.json({ok:false,error:"Competition creation permission required"},{status:403});
 const b=await req.json().catch(()=>null);
 if(!b?.name)return NextResponse.json({ok:false,error:"Competition name is required"},{status:400});
 initializeDatabase();
 const id=randomUUID();
 db.prepare(`INSERT INTO competitions(id,event_id,name,description,status) VALUES(?,?,?,?,?)`)
 .run(id,b.eventId||null,String(b.name),String(b.description||""),b.publish?"PUBLISHED":"DRAFT");
 return NextResponse.json({ok:true,data:{id}},{status:201});
}
