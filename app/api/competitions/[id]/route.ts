import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
import {hasPermission} from "./../../../../lib/permissions";

export const runtime="nodejs";
async function access(permission:string){
 const u=await currentUser(); if(!u)return {u:null,ok:false};
 if(u.role==="FOUNDER")return {u,ok:true};
 if(u.role==="ORGANIZER")return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}
export async function GET(_:Request,{params}:{params:{id:string}}){
 const u=await currentUser(); if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const competition=db.prepare(`SELECT c.*,e.title event_title FROM competitions c LEFT JOIN events e ON e.id=c.event_id WHERE c.id=?`).get(params.id);
 if(!competition)return NextResponse.json({ok:false,error:"Competition not found"},{status:404});
 const rounds=db.prepare("SELECT * FROM competition_rounds WHERE competition_id=? ORDER BY position").all(params.id);
 const participants=db.prepare(`SELECT u.id,u.username,u.display_name,cp.status FROM competition_participants cp
 JOIN users u ON u.id=cp.user_id WHERE cp.competition_id=? ORDER BY u.display_name COLLATE NOCASE`).all(params.id);
 const results=db.prepare(`SELECT cr.*,u.display_name,u.username FROM competition_results cr
 JOIN users u ON u.id=cr.user_id WHERE cr.competition_id=? AND (cr.published=1 OR ? IN ('FOUNDER','ORGANIZER'))
 ORDER BY cr.position`).all(params.id,u.role);
 return NextResponse.json({ok:true,data:{competition,rounds,participants,results}});
}
export async function PATCH(req:Request,{params}:{params:{id:string}}){
 const {u,ok}=await access("competitions.edit");
 if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok)return NextResponse.json({ok:false,error:"Competition edit permission required"},{status:403});
 const b=await req.json().catch(()=>null); initializeDatabase();
 const fields:any={name:b?.name,description:b?.description,status:b?.status,event_id:b?.eventId};
 for(const [f,v] of Object.entries(fields))if(v!==undefined)db.prepare(`UPDATE competitions SET ${f}=? WHERE id=?`).run(String(v),params.id);
 return NextResponse.json({ok:true});
}
