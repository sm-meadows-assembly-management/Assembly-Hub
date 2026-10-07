import {NextResponse} from "next/server";
import {randomUUID} from "crypto";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";
import {notifyAll,createNotification} from "./../../../lib/notifications";
export const runtime="nodejs";

export async function GET(){
 const u=await currentUser(); initializeDatabase();
 const publicRows=db.prepare("SELECT id,title,message,audience,status,event_id,published_at,created_at FROM announcements WHERE status='PUBLISHED' ORDER BY published_at DESC,created_at DESC").all();
 if(!u) return NextResponse.json({ok:true,data:{announcements:publicRows.filter((x:any)=>x.audience==='PUBLIC')}});
 const rows=db.prepare(`SELECT * FROM announcements WHERE status='PUBLISHED' AND (audience='PUBLIC' OR audience IN ('MEMBERS','EVERYONE')) ORDER BY published_at DESC,created_at DESC`).all();
 return NextResponse.json({ok:true,data:{announcements:rows}});
}
export async function POST(req:Request){
 const u=await currentUser(); if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!(u.role==="FOUNDER" || (u.role==="ORGANIZER" && await hasPermission("announcements.create"))))return NextResponse.json({ok:false,error:"Permission denied"},{status:403});
 const b=await req.json().catch(()=>({})); initializeDatabase();
 const id=randomUUID(), status=b.publish?"PUBLISHED":"DRAFT";
 db.prepare(`INSERT INTO announcements(id,title,message,audience,status,event_id,published_at,created_by) VALUES(?,?,?,?,?,?,?,?)`)
  .run(id,String(b.title||"").trim(),String(b.message||"").trim(),b.audience||"MEMBERS",status,b.eventId||null,status==="PUBLISHED"?new Date().toISOString():null,u.id);
 if(status==="PUBLISHED") notifyAnnouncement(id,b.audience,b.title,b.message);
 return NextResponse.json({ok:true,data:{id}});
}
function notifyAnnouncement(id:string,audience:string,title:string,message:string){
 const users=db.prepare("SELECT id,role FROM users WHERE role!='GUEST'").all() as any[];
 for(const x of users){
  const send=audience==="EVERYONE"||audience==="MEMBERS"&&x.role!=="GUEST"||audience==="ORGANIZERS"&&x.role==="ORGANIZER"||audience==="PUBLIC"&&false;
  if(send) createNotification(x.id,"ANNOUNCEMENT",`📢 ${title}`,message,"/member/announcements");
 }
}
