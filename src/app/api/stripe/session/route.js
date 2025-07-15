
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.PAY_SECRET);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return NextResponse.json({ session });
}
