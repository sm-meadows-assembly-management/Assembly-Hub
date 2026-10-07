import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../../lib/server-db";
import {currentUser} from "./../../../../../lib/require-user";

export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:{id:string}}){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 if(u.role==="MEMBER") {
   const row=db.prepare("SELECT * FROM event_registrations WHERE event_id=? AND user_id=?").get(params.id,u.id);
   return NextResponse.json({ok:true,data:{registration:row||null}});
 }
 const rows=db.prepare(`SELECT r.*,u.username,u.display_name FROM event_registrations r
 JOIN users u ON u.id=r.user_id WHERE r.event_id=? ORDER BY u.display_name COLLATE NOCASE`).all(params.id);
 return NextResponse.json({ok:true,data:{registrations:rows}});
}
export async function POST(req:Request,{params}:{params:{id:string}}){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const e=db.prepare("SELECT id,status FROM events WHERE id=?").get(params.id) as any;
 if(!e) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
 const b=await req.json().catch(()=>({}));
 const target=u.role==="MEMBER"?u.id:String(b.userId||"");
 if(!target) return NextResponse.json({ok:false,error:"User id required"},{status:400});
 if(u.role==="MEMBER" && b.userId && b.userId!==u.id) return NextResponse.json({ok:false,error:"Members can only register themselves"},{status:403});
 const status=String(b.status||"GOING");
 if(!["GOING","MAYBE","CANT_ATTEND"].includes(status)) return NextResponse.json({ok:false,error:"Invalid registration status"},{status:400});
 db.prepare(`INSERT INTO event_registrations(id,event_id,user_id,status)
 VALUES(lower(hex(randomblob(16))),?,?,?)
 ON CONFLICT(event_id,user_id) DO UPDATE SET status=excluded.status`).run(params.id,target,status);
 return NextResponse.json({ok:true});
}
