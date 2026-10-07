import {NextResponse} from "next/server";
import {randomUUID} from "crypto";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
import {hasPermission} from "./../../../../lib/permissions";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:{id:string}}){
 const u=await currentUser();initializeDatabase();
 const a=db.prepare("SELECT * FROM albums WHERE id=?").get(params.id) as any;
 if(!a)return NextResponse.json({ok:false,error:"Not found"},{status:404});
 if(a.visibility==="MEMBERS"&&!u)return NextResponse.json({ok:false,error:"Members only"},{status:403});
 const photos=db.prepare("SELECT * FROM photos WHERE album_id=? ORDER BY created_at DESC").all(params.id);
 return NextResponse.json({ok:true,data:{album:a,photos}});
}
export async function POST(req:Request,{params}:{params:{id:string}}){
 const u=await currentUser();if(!u)return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!(u.role==="FOUNDER" || (u.role==="ORGANIZER" && await hasPermission("gallery.manage"))))return NextResponse.json({ok:false,error:"Permission denied"},{status:403});
 const b=await req.json().catch(()=>({}));initializeDatabase();
 const id=randomUUID();db.prepare("INSERT INTO photos(id,album_id,url,caption,uploaded_by) VALUES(?,?,?,?,?)").run(id,params.id,String(b.url||"").trim(),String(b.caption||"").trim(),u.id);
 return NextResponse.json({ok:true,data:{id}});
}
