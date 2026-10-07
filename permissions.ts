import {db,initializeDatabase} from "./server-db";
import {currentUser} from "./require-user";

export const PERMISSIONS = [
  "events.view",
  "events.create",
  "events.edit",
  "events.delete",
  "events.publish",
  "participants.view",
  "participants.manage",
  "activities.view",
  "activities.create",
  "activities.edit",
  "activities.delete",
  "members.view",
  "members.edit",
  "members.manage",
  "achievements.view",
  "competitions.view",
  "competitions.create",
  "competitions.edit",
  "competitions.results",
  "achievements.award",
  "announcements.create",
  "announcements.edit",
  "announcements.delete",
  "announcements.publish",
  "gallery.manage",
  "announcements.edit",
  "announcements.delete",
] as const;

export type Permission=typeof PERMISSIONS[number];

export async function hasPermission(permission:Permission){
  const user=await currentUser();
  if(!user) return false;
  if(user.role==="FOUNDER") return true;
  if(user.role!=="ORGANIZER") return false;
  initializeDatabase();
  const row=db.prepare("SELECT enabled FROM organizer_permissions WHERE user_id=? AND permission=?").get(user.id,permission) as any;
  return row?.enabled===1;
}

export async function requirePermission(permission:Permission){
  const user=await currentUser();
  if(!user) throw new Error("AUTH_REQUIRED");
  if(user.role==="FOUNDER") return user;
  if(user.role!=="ORGANIZER" || !(await hasPermission(permission))) throw new Error("FORBIDDEN");
  return user;
}
