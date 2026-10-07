import { currentUser } from "./require-user";
export async function requireSignedIn(){const user=await currentUser();if(!user) throw new Error("AUTH_REQUIRED");return user}
export async function requireRole(...roles:Array<"FOUNDER"|"ORGANIZER"|"MEMBER">){const user=await requireSignedIn();if(!roles.includes(user.role)) throw new Error("FORBIDDEN");return user}
