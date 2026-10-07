import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { makePasswordHash } from "./auth";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "assembly.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initializeDatabase() {
  const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  db.exec(schema);
  seedDevelopmentUsers();
  seedOrganizerPermissions();
  seedMemberProfiles();
  seedAchievements();
  seedNotificationPreferences();
}

function seedDevelopmentUsers() {
  const users = [
    ["tuhin","Tuhin","FOUNDER"],
    ["rithvik","Rithvik","ORGANIZER"],
    ["shashank","Shashank","ORGANIZER"],
    ["aditya","Aditya","MEMBER"],
    ["joshwa","Joshwa","MEMBER"],
    ["nimalan","Nimalan","MEMBER"],
    ["tejas","Tejas","MEMBER"],
    ["vinaya","Vinaya","MEMBER"],
    ["vihaan","Vihaan","MEMBER"],
    ["likesh","Likesh","MEMBER"],
  ];
  const stmt=db.prepare(`INSERT OR IGNORE INTO users
    (id,username,display_name,role,password_hash)
    VALUES (@id,@username,@display_name,@role,@password_hash)`);
  const tx=db.transaction(()=>users.forEach(([username,name,role])=>stmt.run({
    id:`dev-${username}`,username,display_name:name,role,password_hash:makePasswordHash(process.env.ASSEMBLY_DEV_PASSWORD || "Assembly2026!")
  })));
  tx();
}

function seedOrganizerPermissions() {
  const organizers = db.prepare("SELECT id FROM users WHERE role='ORGANIZER'").all() as any[];
  const defaults = ["events.view","events.create","events.edit","participants.view","participants.manage","activities.view","activities.create","activities.edit","achievements.view","announcements.create","announcements.edit","announcements.publish","gallery.manage"];
  const stmt = db.prepare("INSERT OR IGNORE INTO organizer_permissions(user_id,permission,enabled) VALUES(?,?,1)");
  const tx = db.transaction(() => organizers.forEach(o => defaults.forEach(p => stmt.run(o.id,p))));
  tx();
}

function seedMemberProfiles() {
  const users = db.prepare("SELECT id FROM users").all() as any[];
  const stmt = db.prepare("INSERT OR IGNORE INTO member_profiles(user_id) VALUES(?)");
  const tx = db.transaction(() => users.forEach(u => stmt.run(u.id)));
  tx();
}

function seedAchievements() {
  const rows = [
    ["first-event","First Event","Joined your first Assembly event.","🎉","Attend your first event"],
    ["stage-star","Stage Star","Performed or hosted at an Assembly event.","🌟","Perform or host"],
    ["quiz-master","Quiz Master","Excelled in an Assembly quiz.","🧠","Win or stand out in a quiz"],
    ["team-player","Team Player","Made a great contribution to a team activity.","🤝","Show great teamwork"],
    ["creative-mind","Creative Mind","Created something memorable for Assembly.","🎨","Complete a creative contribution"],
    ["assembly-veteran","Assembly Veteran","Reached a special Assembly participation milestone.","🏅","Milestone achievement"],
    ["competition-winner","Competition Winner","Won an Assembly competition.","🥇","Finish first in a competition"]
  ];
  const stmt = db.prepare("INSERT OR IGNORE INTO achievements(id,name,description,icon,requirement) VALUES(?,?,?,?,?)");
  const tx = db.transaction(() => rows.forEach(r => stmt.run(...r)));
  tx();
}

function seedNotificationPreferences() {
  const users = db.prepare("SELECT id FROM users").all() as any[];
  const stmt = db.prepare("INSERT OR IGNORE INTO notification_preferences(user_id) VALUES(?)");
  const tx = db.transaction(() => users.forEach(u => stmt.run(u.id)));
  tx();
}
