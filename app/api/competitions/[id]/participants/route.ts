import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../../lib/server-db";
import {currentUser} from "./../../../../../lib/require-user";
import {hasPermission} from "./../../../../../lib/permissions";
export const runtime="nodejs";
export async function POST(req:Request,{params}:{params:{id:string}}){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 const b=await req.json().catch(()=>({}));const target=u.role==="MEMBER"?u.id:String(b.userId||"");
 if(!target)return NextResponse.json({ok:false,error:"User id required"},{status:400});
 if(u.role==="MEMBER"&&b.userId&&b.userId!==u.id)return NextResponse.json({ok:false,error:"Members can only join themselves"},{status:403});
 if(u.role==="ORGANIZER"&&!await hasPermission("competitions.edit")||u.role==="FOUNDER"){}
 else if(u.role!=="MEMBER")return NextResponse.json({ok:false,error:"Permission required"},{status:403});
 initializeDatabase();db.prepare(`INSERT OR REPLACE INTO competition_participants(competition_id,user_id,status) VALUES(?,?,?)`).run(params.id,target,"REGISTERED");
 return NextResponse.json({ok:true});
}
