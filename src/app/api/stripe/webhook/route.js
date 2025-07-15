import { buffer } from "micro";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/serverpayment";



const stripe = new Stripe(process.env.PAY_SECRET);

export const config = {
  api: {
    bodyParser: false, // Stripe sends raw body
  },
};

export async function POST(req) {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);
  const sig = req.headers.get("stripe-signature");


  let event;

   try {
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ✅ Handle the event
  if (event.type === "checkout.session.completed") {
  const session = event.data.object;

const supabase = await createSupabaseServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


  const { userId, planName, priceId, features } = session.metadata || {};

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    stripe_subscription_id: session.subscription || null,
    stripe_customer_id: session.customer || null,
    plan_name: planName,
    price_id: priceId,
    status: "active",
    features: features ? JSON.parse(features) : [],
  });

  if (error) {
    console.error("❌ Error saving subscription:", error);
  } else {
    console.log("✅ Subscription saved successfully");
  }
}


  return NextResponse.json({ received: true });
}
