import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
import {hasPermission} from "./../../../../lib/permissions";

export const runtime="nodejs";
async function access(permission:string){
 const u=await currentUser(); if(!u) return {u:null,ok:false};
 if(u.role==="FOUNDER") return {u,ok:true};
 if(u.role==="ORGANIZER") return {u,ok:await hasPermission(permission)};
 return {u,ok:false};
}
export async function PATCH(req:Request,{params}:{params:{id:string}}){
 const {u,ok}=await access("activities.edit");
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Activity edit permission required"},{status:403});
 const b=await req.json().catch(()=>null); initializeDatabase();
 const fields:any={name:b?.name,description:b?.description,category:b?.category,rules:b?.rules,materials:b?.materials,duration:b?.duration,age_suitability:b?.ageSuitability};
 for(const [f,v] of Object.entries(fields)) if(v!==undefined) db.prepare(`UPDATE activities SET ${f}=? WHERE id=?`).run(String(v),params.id);
 return NextResponse.json({ok:true});
}
export async function DELETE(_:Request,{params}:{params:{id:string}}){
 const {u,ok}=await access("activities.delete");
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Activity delete permission required"},{status:403});
 initializeDatabase(); db.prepare("DELETE FROM activities WHERE id=?").run(params.id);
 return NextResponse.json({ok:true});
}
