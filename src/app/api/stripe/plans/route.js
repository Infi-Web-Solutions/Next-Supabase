import Stripe from "stripe";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClientWithCookies } from "@/lib/serverpayment"

import supabaseAdmin from "@/lib/supabase/serveclient";

function getSubdomain(host) {
  const parts = host.split(".");
  return parts.length >= 3 ? parts[0] : null;
}

export async function GET(req) {
  try {
    const host = req.headers.get("host") || "";
    const subdomain = getSubdomain(host);

    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("slug", subdomain)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 }
      );
    }

    const organization_id = org.id;

    const { data: stripeCred, error: stripeError } = await supabaseAdmin
      .from("stripe_credentials")
      .select("stripe_secret_key")
      .eq("organization_id", organization_id)
      .single();

    if (stripeError || !stripeCred) {
      return NextResponse.json(
        { success: false, error: "Stripe credentials not found" },
        { status: 404 }
      );
    }

    const stripe = new Stripe(stripeCred.stripe_secret_key, {
      apiVersion: "2023-10-16",
    });

    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      recurring: { interval: "month" },
    });

    const plans = prices.data.map((price) => {
      const product = price.product;
      const metadata = product.metadata || {};

      const features = Object.entries(metadata)
        .filter(([key]) => key.startsWith("feature"))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, value]) => value);

      return {
        id: price.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount,
        features,
        planName: metadata.planName || "custom",
      };
    });

    return NextResponse.json({ success: true, plans });
  } catch (err) {
    console.error("Plan fetch error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { priceId } = await req.json();
    const host = req.headers.get("host") || "";
    const subdomain = getSubdomain(host);

    if (!subdomain) {
      return NextResponse.json(
        { success: false, error: "Invalid subdomain." },
        { status: 400 }
      );
    }

    const supabase = createServerClientWithCookies();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to subscribe." },
        { status: 401 }
      );
    }

    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", subdomain)
      .single();

    if (orgError || !orgData?.id) {
      return NextResponse.json(
        { success: false, error: "Organization not found." },
        { status: 404 }
      );
    }

    const { data: stripeData, error: stripeError } = await supabase
      .from("stripe_credentials")
      .select("stripe_secret_key")
      .eq("organization_id", orgData.id)
      .single();

    if (stripeError || !stripeData?.stripe_secret_key) {
      return NextResponse.json(
        { success: false, error: "Stripe credentials not found." },
        { status: 404 }
      );
    }

    const stripe = new Stripe(stripeData.stripe_secret_key, {
      apiVersion: "2024-04-10",
    });

    const price = await stripe.prices.retrieve(priceId, {
      expand: ["product"],
    });

    const product = price.product;
    const planName = product.metadata?.planName || "custom";

    const features = Object.entries(product.metadata || {})
      .filter(([key]) => key.startsWith("feature"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => {
        const name = value.trim().toLowerCase();
        return {
          name,
          description: `Access to ${name}`,
          enabled: true,
        };
      });

    // Get user info
    const userId = user.id;
    const customerEmail = user.email;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        email: customerEmail || "",
        planName,
        features: JSON.stringify(features),
        organization_id: orgData.id,
      },
      success_url: `http://${host}/plan?status/plan`,
      cancel_url: `http://${host}/plan?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Subscribe Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}