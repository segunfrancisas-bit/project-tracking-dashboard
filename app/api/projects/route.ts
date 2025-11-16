// app/api/projects/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

async function readDB() {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw);
}

async function writeDB(json: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), "utf8");
}

export async function GET(req: Request) {
  try {
    const db = await readDB();
    return NextResponse.json(db);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT used to update a single project by id
 * Body: { id: string, updates: { workProgress?: number, targetProgress?: number, ... } }
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body;
    if (!id || !updates) {
      return NextResponse.json({ error: "id and updates required" }, { status: 400 });
    }

    const db = await readDB();
    const idx = db.projects.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }

    // merge updates
    db.projects[idx] = { ...db.projects[idx], ...updates };

    await writeDB(db);
    return NextResponse.json({ success: true, project: db.projects[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
