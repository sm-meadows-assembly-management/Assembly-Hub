import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const root = process.cwd();
const dataDir = path.join(root, "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "assembly.sqlite"));
db.pragma("foreign_keys = ON");
db.exec(fs.readFileSync(path.join(root, "db", "schema.sql"), "utf8"));
console.log("Assembly SQLite database initialized.");
