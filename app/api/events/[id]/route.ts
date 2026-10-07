import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
import {hasPermission} from "./../../../../lib/permissions";
import {notifyAll} from "./../../../../lib/notifications";

export const runtime="nodejs";
async function access(permission:string){
 const u=await currentUser(); if(!u) return {u:null,ok:false};
 if(u.role==="FOUNDER") return {u,ok:true};
 if(u.role==="ORGANIZER") return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}
export async function GET(_:Request,{params}:{params:{id:string}}){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const event=db.prepare(`SELECT e.*,(SELECT COUNT(*) FROM event_registrations r WHERE r.event_id=e.id) participant_count
 FROM events e WHERE e.id=?`).get(params.id) as any;
 if(!event) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
 if(event.status!=="PUBLISHED" && u.role==="MEMBER") return NextResponse.json({ok:false,error:"Event not available"},{status:403});
 const eventActivities=db.prepare(`SELECT a.*,ea.position FROM event_activities ea JOIN activities a ON a.id=ea.activity_id WHERE ea.event_id=? ORDER BY ea.position`).all(params.id);
 const participants=db.prepare(`SELECT u.id,u.username,u.display_name,r.status,
 COALESCE(a.status,'NOT_MARKED') attendance
 FROM event_registrations r JOIN users u ON u.id=r.user_id
 LEFT JOIN attendance a ON a.event_id=r.event_id AND a.user_id=r.user_id
 WHERE r.event_id=? ORDER BY u.display_name COLLATE NOCASE`).all(params.id);
 return NextResponse.json({ok:true,data:{event,participants,eventActivities}});
}
export async function PATCH(req:Request,{params}:{params:{id:string}}){
 const {u,ok}=await access("events.edit");
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Event edit permission required"},{status:403});
 const b=await req.json().catch(()=>null); initializeDatabase();
 const e=db.prepare("SELECT id FROM events WHERE id=?").get(params.id);
 if(!e) return NextResponse.json({ok:false,error:"Event not found"},{status:404});
 const fields=["title","description","start_at","end_at","location","status"] as const;
 const map:any={title:b?.title,description:b?.description,start_at:b?.startAt,end_at:b?.endAt,location:b?.location,status:b?.status};
 const was=db.prepare("SELECT status FROM events WHERE id=?").get(params.id) as any;
 for(const f of fields) if(map[f]!==undefined)
   db.prepare(`UPDATE events SET ${f}=? WHERE id=?`).run(String(map[f]),params.id);
 if(b?.status==="PUBLISHED" && was?.status!=="PUBLISHED"){
   notifyAll("EVENT","New Assembly Event",`A new event is ready: ${b?.title||"Assembly event"}`,`/member/events/${params.id}`);
 }
 return NextResponse.json({ok:true});
}
export async function DELETE(_:Request,{params}:{params:{id:string}}){
 const {u,ok}=await access("events.delete");
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Event delete permission required"},{status:403});
 initializeDatabase(); db.prepare("DELETE FROM events WHERE id=?").run(params.id);
 return NextResponse.json({ok:true});
}
