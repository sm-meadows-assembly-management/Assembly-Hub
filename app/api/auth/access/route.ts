import {NextResponse} from "next/server";
import {currentUser} from "./../../../../lib/require-user";
export const runtime="nodejs";
export async function GET(){
 const user=await currentUser();
 if(!user) return NextResponse.json({ok:false,error:"Not signed in"},{status:401});
 return NextResponse.json({ok:true,data:{user,permissions:{
  founder:user.role==="FOUNDER",
  organizer:["FOUNDER","ORGANIZER"].includes(user.role),
  member:["FOUNDER","ORGANIZER","MEMBER"].includes(user.role)
 }}})
}
