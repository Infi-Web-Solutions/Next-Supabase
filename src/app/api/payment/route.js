
import { NextResponse } from "next/server";
import { createServerClientWithCookies } from "@/lib/serverpayment";
import Stripe from "stripe";


export async function POST(req) {
  try {


    const host = req.headers.get("host");
    const protocol = "http" ;
    const baseUrl = `${protocol}://${host}`;


    const { product } = await req.json();

    const supabase = createServerClientWithCookies();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Please login first",
          redirectTo: "/auth/login",
        },
        { status: 401 }
      );
    }

    const organization_id = user.user_metadata?.organization_id;

    if (!organization_id) {
      return NextResponse.json(
        { success: false, error: "Missing organization_id" },
        { status: 400 }
      );
    }
 const { data: orgData, error: orgError } = await supabase
  .from("stripe_credentials")
  .select("stripe_secret_key")
  .eq("organization_id", organization_id)
  .maybeSingle();


    console.log("stripekey", orgData)

    if (orgError || !orgData?.stripe_secret_key) {
      return NextResponse.json(
        { success: false, error: "Stripe key not found for organization" },
        { status: 500 }
      );
    }

    // ✅ Initialize Stripe with the correct key
    const stripe = new Stripe(orgData.stripe_secret_key);

    // ✅ Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        userId: user.id,
        email: user.email,
        quantity: 1,
        paymentIntentId: "",
        organization_id: organization_id,
      },
      // success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products`,
    });

    return NextResponse.json({ success: true, url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
