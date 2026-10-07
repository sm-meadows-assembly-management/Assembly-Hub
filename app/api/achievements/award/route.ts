import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
import {hasPermission} from "./../../../../lib/permissions";
import {createNotification} from "./../../../../lib/notifications";
export const runtime="nodejs";
export async function POST(req:Request){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(u.role!=="FOUNDER" && !(u.role==="ORGANIZER"&&await hasPermission("achievements.award")))
   return NextResponse.json({ok:false,error:"Achievement award permission required"},{status:403});
 const b=await req.json().catch(()=>null);if(!b?.userId||!b?.achievementId)return NextResponse.json({ok:false,error:"Member and achievement are required"},{status:400});
 initializeDatabase();
 const exists=db.prepare("SELECT id FROM achievements WHERE id=?").get(b.achievementId);
 if(!exists)return NextResponse.json({ok:false,error:"Achievement not found"},{status:404});
 const achievement=db.prepare("SELECT name,icon FROM achievements WHERE id=?").get(b.achievementId) as any;
 db.prepare(`INSERT OR IGNORE INTO member_achievements(achievement_id,user_id,awarded_by,source_type,source_id)
 VALUES(?,?,?,?,?)`).run(b.achievementId,b.userId,u.id,String(b.sourceType||"MANUAL"),b.sourceId||null);
 createNotification(b.userId,"ACHIEVEMENT",`${achievement?.icon||"🏆"} Achievement unlocked!`,`You unlocked ${achievement?.name||"a new achievement"}.`,"/member/achievements");
 return NextResponse.json({ok:true});
}
