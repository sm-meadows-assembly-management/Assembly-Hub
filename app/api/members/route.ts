import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../lib/server-db";
import {currentUser} from "./../../../lib/require-user";
import {hasPermission} from "./../../../lib/permissions";

export const runtime="nodejs";

async function canManage(){
 const u=await currentUser();
 if(!u) return {u:null,ok:false};
 if(u.role==="FOUNDER") return {u,ok:true};
 if(u.role==="ORGANIZER" && await hasPermission("members.manage")) return {u,ok:true};
 return {u,ok:false};
}

export async function GET(){
 const {u,ok}=await canManage();
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Member management permission required"},{status:403});
 initializeDatabase();
 const members=db.prepare(`
 SELECT u.id,u.username,u.display_name,u.role,u.created_at,
        COALESCE(p.bio,'') bio,COALESCE(p.avatar_url,'') avatar_url,
        COALESCE(p.member_since,u.created_at) member_since
 FROM users u LEFT JOIN member_profiles p ON p.user_id=u.id
 ORDER BY u.display_name COLLATE NOCASE
 `).all();
 return NextResponse.json({ok:true,data:{members}});
}

export async function PATCH(req:Request){
 const {u,ok}=await canManage();
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 if(!ok) return NextResponse.json({ok:false,error:"Member management permission required"},{status:403});
 const b=await req.json().catch(()=>null);
 if(!b?.id) return NextResponse.json({ok:false,error:"Member id required"},{status:400});
 initializeDatabase();
 const target=db.prepare("SELECT id,role FROM users WHERE id=?").get(b.id) as any;
 if(!target) return NextResponse.json({ok:false,error:"Member not found"},{status:404});
 if(target.role==="FOUNDER") return NextResponse.json({ok:false,error:"Founder account cannot be changed here"},{status:403});
 if(b.role && !["MEMBER","ORGANIZER"].includes(b.role)) return NextResponse.json({ok:false,error:"Invalid role"},{status:400});
 const tx=db.transaction(()=>{
   if(b.displayName!==undefined) db.prepare("UPDATE users SET display_name=? WHERE id=?").run(String(b.displayName).trim(),b.id);
   if(b.role!==undefined) db.prepare("UPDATE users SET role=? WHERE id=?").run(b.role,b.id);
   db.prepare(`INSERT INTO member_profiles(user_id,bio,avatar_url) VALUES(?,?,?)
     ON CONFLICT(user_id) DO UPDATE SET bio=excluded.bio,avatar_url=excluded.avatar_url`)
     .run(b.id,String(b.bio??""),String(b.avatarUrl??""));
 });
 tx();
 return NextResponse.json({ok:true});
}
