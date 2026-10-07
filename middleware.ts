import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(req:NextRequest){
 const path=req.nextUrl.pathname;
 const privateArea=path.startsWith("/founder")||path.startsWith("/organizer")||path.startsWith("/member");
 if(!privateArea) return NextResponse.next();
 const cookie=req.cookies.get("assembly_session");
 if(!cookie?.value) return NextResponse.redirect(new URL("/login",req.url));
 return NextResponse.next();
}
export const config={matcher:["/founder/:path*","/organizer/:path*","/member/:path*"]};
