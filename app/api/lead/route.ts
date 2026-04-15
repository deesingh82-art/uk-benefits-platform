import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const lead = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      postcode: String(form.get("postcode") || ""),
      type: String(form.get("type") || ""),
      message: String(form.get("message") || ""),
    };

    const { error } = await supabaseAdmin.from("leads").insert([lead]);

    if (error) {
      return NextResponse.json(
        { error: "Could not save lead", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.redirect(new URL("/thank-you", req.url));
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}