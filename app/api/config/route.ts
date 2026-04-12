import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET() {
  const { data, error } = await supabaseAdmin.from("config").select("key,value");

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to load config" },
      { status: 500 }
    );
  }

  const config: Record<string, string> = {};
  for (const row of data) {
    config[row.key] = row.value;
  }

  return NextResponse.json(config);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = Object.entries(body.data).map(([key, value]) => ({
      key,
      value: String(value ?? ""),
    }));

    const { error } = await supabaseAdmin
      .from("config")
      .upsert(payload, { onConflict: "key" });

    if (error) {
      return NextResponse.json(
        { error: "Failed to save config", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error saving config",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}