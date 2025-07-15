
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/serverpayment";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("plan_name, features")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (subError && subError.code !== "PGRST116") {
      throw subError;
    }

    return NextResponse.json({
      success: true,
      data: {
        planName: subscription?.plan_name || "free",
        features: subscription?.features || [],
      },
    });
  } catch (err) {
    console.error("Error in /api/plans:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
