import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";
import {randomUUID} from "crypto";

export const runtime="nodejs";
async function access(permission:string){
 const u=await currentUser(); if(!u) return {u:null,ok:false};
 if(u.role==="FOUNDER") return {u,ok:true};
 if(u.role==="ORGANIZER") return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}
export async function GET(){
 const u=await currentUser(); if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const activities=db.prepare("SELECT * FROM activities ORDER BY name COLLATE NOCASE").all();
 return NextResponse.json({ok:true,data:{activities}});
}
export async function POST(req:Request){
 const {u,ok}=await access("activities.create");
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Activity creation permission required"},{status:403});
 const b=await req.json().catch(()=>null);
 if(!b?.name) return NextResponse.json({ok:false,error:"Activity name is required"},{status:400});
 initializeDatabase();
 const id=randomUUID();
 db.prepare(`INSERT INTO activities(id,name,description,category,rules,materials,duration,age_suitability)
 VALUES(?,?,?,?,?,?,?,?)`).run(id,String(b.name),String(b.description||""),String(b.category||"Games"),String(b.rules||""),String(b.materials||""),String(b.duration||""),String(b.ageSuitability||""));
 return NextResponse.json({ok:true,data:{id}},{status:201});
}
