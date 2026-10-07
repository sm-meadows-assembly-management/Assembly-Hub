import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
export const runtime="nodejs";
export async function GET(){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const notifications=db.prepare("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100").all(u.id);
 const unread=(db.prepare("SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL").get(u.id) as any).c;
 return NextResponse.json({ok:true,data:{notifications,unread}});
}
export async function PATCH(req:Request){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 const b=await req.json().catch(()=>({}));initializeDatabase();
 if(b?.all) db.prepare("UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE user_id=? AND read_at IS NULL").run(u.id);
 else if(b?.id) db.prepare("UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?").run(b.id,u.id);
 return NextResponse.json({ok:true});
}
