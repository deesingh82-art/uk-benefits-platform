import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const age = Number(body.age) || 0;
    const income = Number(body.income) || 0;
    const partnerIncome = Number(body.partnerIncome) || 0;
    const children = Number(body.children) || 0;
    const rent = Number(body.rent) || 0;
    const capital = Number(body.capital) || 0;
    const hasDisability = body.hasDisability === "yes";
    const hasHousingElement = body.hasHousingElement === "yes";

    const { data, error } = await supabaseAdmin
      .from("config")
      .select("key,value");

    if (error || !data) {
      return NextResponse.json(
        {
          error: "Could not load live rates from Supabase",
          details: error?.message || "No data returned",
        },
        { status: 500 }
      );
    }

    const config: Record<string, number> = {};
    for (const row of data) {
      config[row.key] = Number(row.value);
    }

    const standard =
      age >= 25 ? config.uc_standard_over_25 : config.uc_standard_under_25;

    const childAmount = children * config.child_element;
    const housing = hasHousingElement ? rent : 0;
    const disability = hasDisability ? config.lcwra : 0;

    if (capital >= 16000) {
      return NextResponse.json({
        uc: "0.00",
        breakdown: {
          standard,
          children: childAmount,
          rent: housing,
          disability,
          deduction: "0.00",
          workAllowance: 0,
          tariffIncome: "0.00",
        },
      });
    }

    let tariffIncome = 0;
    if (capital > 6000) {
      tariffIncome = Math.floor((capital - 6000) / 250) * 4.35;
    }

    let workAllowance = 0;
    if (children > 0 || hasDisability) {
      workAllowance = hasHousingElement ? 404 : 673;
    }

    const totalBefore = standard + childAmount + housing + disability;
    const earnedIncome = income + partnerIncome;
    const adjustedIncome =
      Math.max(earnedIncome - workAllowance, 0) + tariffIncome;
    const deduction = adjustedIncome * config.taper_rate;

    let final = totalBefore - deduction;
    if (final < 0) final = 0;

    return NextResponse.json({
      uc: final.toFixed(2),
      breakdown: {
        standard,
        children: childAmount,
        rent: housing,
        disability,
        deduction: deduction.toFixed(2),
        workAllowance,
        tariffIncome: tariffIncome.toFixed(2),
      },
      source: "supabase",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error while calculating benefits",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}