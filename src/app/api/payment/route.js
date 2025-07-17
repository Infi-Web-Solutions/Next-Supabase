import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createServerClientWithCookies } from "@/lib/serverpayment";

const stripe = new Stripe(process.env.PAY_SECRET);

export async function POST(req) {
  try {
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
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
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
