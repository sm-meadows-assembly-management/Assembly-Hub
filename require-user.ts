import {cookies} from "next/headers";
import {getSessionUser,sessionCookie,SessionUser} from "./auth";
export async function currentUser():Promise<SessionUser|null>{const c=await cookies();return getSessionUser(c.get(sessionCookie)?.value)}
