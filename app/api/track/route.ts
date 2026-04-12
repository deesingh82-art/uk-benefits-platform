import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabaseAdmin
      .from("calculator_events")
      .insert({
        event_type: body.event_type || "unknown",
        payload: body.payload || {},
      });

    if (error) {
      return NextResponse.json(
        { error: "Failed to track event", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error tracking event",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}