import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
export const runtime="nodejs";
export async function GET(){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const all=db.prepare(`SELECT a.id,a.name,a.description,a.icon,a.requirement,
 CASE WHEN ma.user_id IS NULL THEN 0 ELSE 1 END unlocked,ma.awarded_at
 FROM achievements a LEFT JOIN member_achievements ma ON ma.achievement_id=a.id AND ma.user_id=?
 ORDER BY unlocked DESC,a.name`).all(u.id);
 return NextResponse.json({ok:true,data:{achievements:all}});
}
