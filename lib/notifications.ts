import {db,initializeDatabase} from "./server-db";
import {randomUUID} from "crypto";

export function createNotification(userId:string,type:string,title:string,message:string="",link:string=""){
 initializeDatabase();
 const prefs=db.prepare("SELECT * FROM notification_preferences WHERE user_id=?").get(userId) as any;
 const enabled = !prefs || type==="GENERAL" ||
   (type==="EVENT"&&prefs.events) || (type==="ACHIEVEMENT"&&prefs.achievements) ||
   (type==="COMPETITION"&&prefs.competitions) || (type==="ANNOUNCEMENT"&&prefs.announcements);
 if(!enabled)return;
 db.prepare(`INSERT INTO notifications(id,user_id,type,title,message,link) VALUES(?,?,?,?,?,?)`)
   .run(randomUUID(),userId,type,title,message,link);
}
export function notifyAll(type:string,title:string,message:string="",link:string=""){
 const users=db.prepare("SELECT id FROM users WHERE role!='GUEST'").all() as any[];
 for(const u of users) createNotification(u.id,type,title,message,link);
}
