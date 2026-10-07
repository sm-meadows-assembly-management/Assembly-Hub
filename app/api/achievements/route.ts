import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";
import {randomUUID} from "crypto";
export const runtime="nodejs";

async function staff(permission:string){
 const u=await currentUser(); if(!u)return {u:null,ok:false};
 if(u.role==="FOUNDER")return {u,ok:true};
 if(u.role==="ORGANIZER")return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}
export async function GET(){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const rows=db.prepare(`SELECT a.*,COUNT(ma.user_id) award_count FROM achievements a
 LEFT JOIN member_achievements ma ON ma.achievement_id=a.id GROUP BY a.id ORDER BY a.name`).all();
 return NextResponse.json({ok:true,data:{achievements:rows}});
}
export async function POST(req:Request){
 const {u,ok}=await staff("achievements.view");
 if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok)return NextResponse.json({ok:false,error:"Achievement permission required"},{status:403});
 const b=await req.json().catch(()=>null);if(!b?.name)return NextResponse.json({ok:false,error:"Name required"},{status:400});
 initializeDatabase();
 const id=randomUUID();
 db.prepare("INSERT INTO achievements(id,name,description,icon,requirement) VALUES(?,?,?,?,?)")
 .run(id,String(b.name),String(b.description||""),String(b.icon||"🏆"),String(b.requirement||""));
 return NextResponse.json({ok:true,data:{id}},{status:201});
}
