import {NextResponse} from "next/server";
import {db,initializeDatabase} from "./../../../../lib/server-db";
import {currentUser} from "./../../../../lib/require-user";

export const runtime="nodejs";

export async function GET(){
 const u=await currentUser();
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 initializeDatabase();
 const profile=db.prepare(`SELECT u.id,u.username,u.display_name,u.role,u.created_at,
   COALESCE(p.bio,'') bio,COALESCE(p.avatar_url,'') avatar_url,
   COALESCE(p.member_since,u.created_at) member_since
   FROM users u LEFT JOIN member_profiles p ON p.user_id=u.id WHERE u.id=?`).get(u.id);
 return NextResponse.json({ok:true,data:profile});
}

export async function PATCH(req:Request){
 const u=await currentUser();
 if(!u) return NextResponse.json({ok:false,error:"Sign in required"},{status:401});
 const b=await req.json().catch(()=>null);
 if(!b) return NextResponse.json({ok:false,error:"Invalid request"},{status:400});
 if(b.displayName!==undefined && !String(b.displayName).trim()) return NextResponse.json({ok:false,error:"Name cannot be empty"},{status:400});
 if(String(b.bio??"").length>500) return NextResponse.json({ok:false,error:"Bio is too long"},{status:400});
 initializeDatabase();
 db.prepare(`INSERT INTO member_profiles(user_id,bio,avatar_url) VALUES(?,?,?)
 ON CONFLICT(user_id) DO UPDATE SET bio=excluded.bio,avatar_url=excluded.avatar_url`)
 .run(u.id,String(b.bio??""),String(b.avatarUrl??""));
 if(b.displayName!==undefined)
   db.prepare("UPDATE users SET display_name=? WHERE id=?").run(String(b.displayName).trim(),u.id);
 return NextResponse.json({ok:true});
}
