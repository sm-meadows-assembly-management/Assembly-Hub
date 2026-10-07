import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../../lib/server-db";
import {currentUser} from "./../../../../../lib/require-user";
import {hasPermission} from "./../../../../../lib/permissions";
import {randomUUID} from "crypto";
export const runtime="nodejs";
async function ok(){const u=await currentUser();return u&& (u.role==="FOUNDER"||(u.role==="ORGANIZER"&&await hasPermission("competitions.edit")))?u:null}
export async function POST(req:Request,{params}:{params:{id:string}}){
 const u=await ok();if(!u)return NextResponse.json({ok:false,error:"Competition edit permission required"},{status:403});
 const b=await req.json().catch(()=>null);if(!b?.name)return NextResponse.json({ok:false,error:"Round name required"},{status:400});
 initializeDatabase();const n=(db.prepare("SELECT COUNT(*) c FROM competition_rounds WHERE competition_id=?").get(params.id) as any).c;
 db.prepare("INSERT INTO competition_rounds(id,competition_id,name,position) VALUES(?,?,?,?)").run(randomUUID(),params.id,String(b.name),n);
 return NextResponse.json({ok:true});
}
