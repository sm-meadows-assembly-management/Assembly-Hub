import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";
import {PERMISSIONS} from "./../../../../lib/permissions";

export const runtime="nodejs";

export async function GET(){
 const user=await currentUser();
 if(!user||user.role!=="FOUNDER") return NextResponse.json({ok:false,error:"Founder access required"},{status:403});
 initializeDatabase();
 const organizers=db.prepare("SELECT id,username,display_name,role FROM users WHERE role='ORGANIZER' ORDER BY display_name").all() as any[];
 const rows=db.prepare("SELECT user_id,permission,enabled FROM organizer_permissions").all() as any[];
 const permissions=organizers.map(o=>({user:o,permissions:Object.fromEntries(PERMISSIONS.map(p=>[p,rows.find(r=>r.user_id===o.id&&r.permission===p)?.enabled===1]))}));
 return NextResponse.json({ok:true,data:{available:PERMISSIONS,organizers:permissions}});
}

export async function POST(req:Request){
 const founder=await currentUser();
 if(!founder||founder.role!=="FOUNDER") return NextResponse.json({ok:false,error:"Founder access required"},{status:403});
 const b=await req.json().catch(()=>null);
 if(!b?.userId||!PERMISSIONS.includes(b.permission)) return NextResponse.json({ok:false,error:"Invalid permission"},{status:400});
 initializeDatabase();
 const target=db.prepare("SELECT id,role FROM users WHERE id=?").get(b.userId) as any;
 if(!target||target.role!=="ORGANIZER") return NextResponse.json({ok:false,error:"Organizer not found"},{status:404});
 db.prepare(`INSERT INTO organizer_permissions(user_id,permission,enabled,updated_at)
 VALUES(?,?,?,CURRENT_TIMESTAMP)
 ON CONFLICT(user_id,permission) DO UPDATE SET enabled=excluded.enabled,updated_at=CURRENT_TIMESTAMP`)
 .run(b.userId,b.permission,b.enabled?1:0);
 return NextResponse.json({ok:true});
}
