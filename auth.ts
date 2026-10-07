import crypto from "crypto";
import { db, initializeDatabase } from "./server-db";
const SESSION_COOKIE="assembly_session";
const SESSION_DAYS=30;
export type SessionUser={id:string;username:string;display_name:string;role:"FOUNDER"|"ORGANIZER"|"MEMBER"};
function hashPassword(password:string,salt:string){return crypto.scryptSync(password,salt,64).toString("hex")}
export function makePasswordHash(password:string){const salt=crypto.randomBytes(16).toString("hex");return `${salt}:${hashPassword(password,salt)}`}
export function verifyPassword(password:string,stored:string){const [salt,hash]=stored.split(":");if(!salt||!hash)return false;const actual=hashPassword(password,salt);return crypto.timingSafeEqual(Buffer.from(actual,"hex"),Buffer.from(hash,"hex"))}
export function createSession(userId:string){initializeDatabase();const id=crypto.randomBytes(32).toString("hex");const expires=new Date(Date.now()+SESSION_DAYS*86400000).toISOString();db.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,?)").run(id,userId,expires);return{id,expires}}
export function getSessionUser(sessionId?:string):SessionUser|null{if(!sessionId)return null;initializeDatabase();const row=db.prepare(`SELECT u.id,u.username,u.display_name,u.role,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=?`).get(sessionId) as any;if(!row)return null;if(new Date(row.expires_at).getTime()<=Date.now()){db.prepare("DELETE FROM sessions WHERE id=?").run(sessionId);return null}return{id:row.id,username:row.username,display_name:row.display_name,role:row.role}}
export function deleteSession(sessionId?:string){if(sessionId){initializeDatabase();db.prepare("DELETE FROM sessions WHERE id=?").run(sessionId)}}
export const sessionCookie=SESSION_COOKIE;
