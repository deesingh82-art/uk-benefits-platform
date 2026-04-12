import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    if (!supabaseUrl) {
      return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
    }

    if (!serviceKey) {
      return NextResponse.json({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase.from("config").select("key,value").limit(5);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Supabase query error",
          details: error.message,
          url: supabaseUrl,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: supabaseUrl,
      rows: data,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase fetch failed",
        details: err instanceof Error ? err.message : "Unknown error",
        url: supabaseUrl ?? null,
      },
      { status: 500 }
    );
  }
}