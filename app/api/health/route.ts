import { NextResponse } from "next/server";
import { initializeDatabase } from "./../../../lib/server-db";

export const runtime = "nodejs";

export async function GET() {
  initializeDatabase();
  return NextResponse.json({
    ok: true,
    service: "Assembly",
    database: "SQLite",
    message: "Assembly backend is alive."
  });
}
