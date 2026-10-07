import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../../lib/server-db";
import {currentUser} from "./../../../../../lib/require-user";
import {hasPermission} from "./../../../../../lib/permissions";
import {createNotification} from "./../../../../../lib/notifications";
import {randomUUID} from "crypto";
export const runtime="nodejs";
async function staff(){const u=await currentUser();return u&&(u.role==="FOUNDER"||(u.role==="ORGANIZER"&&await hasPermission("competitions.results")))?u:null}
export async function POST(req:Request,{params}:{params:{id:string}}){
 const u=await staff();if(!u)return NextResponse.json({ok:false,error:"Results permission required"},{status:403});
 const b=await req.json().catch(()=>null);if(!b?.userId)return NextResponse.json({ok:false,error:"User id required"},{status:400});
 initializeDatabase();
 db.prepare(`INSERT INTO competition_results(id,competition_id,round_id,user_id,position,score,published)
 VALUES(?,?,?,?,?,?,?) ON CONFLICT(competition_id,round_id,user_id) DO UPDATE SET position=excluded.position,score=excluded.score,published=excluded.published`)
 .run(randomUUID(),params.id,b.roundId||null,b.userId,b.position??null,String(b.score??""),b.published?1:0);
 return NextResponse.json({ok:true});
}
export async function PATCH(req:Request,{params}:{params:{id:string}}){
 const u=await staff();if(!u)return NextResponse.json({ok:false,error:"Results permission required"},{status:403});
 const b=await req.json().catch(()=>null);initializeDatabase();
 db.prepare("UPDATE competition_results SET published=? WHERE competition_id=?").run(b?.published?1:0,params.id);
 if(b?.published){
   const winner=db.prepare("SELECT user_id FROM competition_results WHERE competition_id=? AND position=1 ORDER BY created_at LIMIT 1").get(params.id) as any;
   const achievement=db.prepare("SELECT id FROM achievements WHERE id='competition-winner'").get() as any;
   if(winner&&achievement) { db.prepare(`INSERT OR IGNORE INTO member_achievements(achievement_id,user_id,awarded_by,source_type,source_id) VALUES(?,?,?,?,?)`).run(achievement.id,winner.user_id,u.id,"COMPETITION",params.id); createNotification(winner.user_id,"ACHIEVEMENT","🥇 Competition Winner!","Congratulations — you won the competition!","/member/achievements"); }
 }
 return NextResponse.json({ok:true});
}
