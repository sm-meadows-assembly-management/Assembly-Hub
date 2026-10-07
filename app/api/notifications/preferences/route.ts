import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
export const runtime="nodejs";
export async function GET(){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();const p=db.prepare("SELECT * FROM notification_preferences WHERE user_id=?").get(u.id);
 return NextResponse.json({ok:true,data:{preferences:p}});
}
export async function PATCH(req:Request){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 const b=await req.json().catch(()=>null);initializeDatabase();
 db.prepare(`INSERT INTO notification_preferences(user_id,events,achievements,competitions,announcements) VALUES(?,?,?,?,?)
 ON CONFLICT(user_id) DO UPDATE SET events=excluded.events,achievements=excluded.achievements,competitions=excluded.competitions,announcements=excluded.announcements`)
 .run(u.id,b?.events?1:0,b?.achievements?1:0,b?.competitions?1:0,b?.announcements?1:0);
 return NextResponse.json({ok:true});
}
