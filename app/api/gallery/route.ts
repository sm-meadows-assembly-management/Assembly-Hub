import {NextResponse} from "next/server";
import {randomUUID} from "crypto";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";
export const runtime="nodejs";
export async function GET(){
 const u=await currentUser();initializeDatabase();
 const rows=db.prepare(`SELECT a.*,e.title event_title,(SELECT COUNT(*) FROM photos p WHERE p.album_id=a.id) photo_count FROM albums a LEFT JOIN events e ON e.id=a.event_id WHERE a.visibility='PUBLIC' ${u?"OR a.visibility='MEMBERS'":""} ORDER BY a.created_at DESC`).all();
 return NextResponse.json({ok:true,data:{albums:rows}});
}
export async function POST(req:Request){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!(u.role==="FOUNDER" || (u.role==="ORGANIZER" && await hasPermission("gallery.manage"))))return NextResponse.json({ok:false,error:"Permission denied"},{status:403});
 const b=await req.json().catch(()=>({}));initializeDatabase();const id=randomUUID();
 db.prepare("INSERT INTO albums(id,event_id,title,description,visibility,created_by) VALUES(?,?,?,?,?,?)").run(id,b.eventId||null,String(b.title||"").trim(),String(b.description||"").trim(),b.visibility||"MEMBERS",u.id);
 return NextResponse.json({ok:true,data:{id}});
}
