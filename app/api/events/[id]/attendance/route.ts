import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../../lib/server-db";
import {currentUser} from "./../../../../../lib/require-user";
import {hasPermission} from "./../../../../../lib/permissions";

export const runtime="nodejs";
export async function POST(req:Request,{params}:{params:{id:string}}){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(u.role!=="FOUNDER" && !(u.role==="ORGANIZER" && await hasPermission("participants.manage")))
   return NextResponse.json({ok:false,error:"Attendance permission required"},{status:403});
 const b=await req.json().catch(()=>null); if(!b?.userId) return NextResponse.json({ok:false,error:"User id required"},{status:400});
 if(!["PRESENT","ABSENT","LATE"].includes(b.status)) return NextResponse.json({ok:false,error:"Invalid attendance status"},{status:400});
 initializeDatabase();
 db.prepare(`INSERT INTO attendance(id,event_id,user_id,status) VALUES(lower(hex(randomblob(16))),?,?,?)
 ON CONFLICT(event_id,user_id) DO UPDATE SET status=excluded.status,marked_at=CURRENT_TIMESTAMP`)
 .run(params.id,b.userId,b.status);
 return NextResponse.json({ok:true});
}
