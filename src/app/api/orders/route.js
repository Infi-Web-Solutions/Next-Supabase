import Stripe from "stripe";
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serveclient";
import { cookies } from 'next/headers';
import { createServerClientWithCookies } from '@/lib/serverpayment';


const stripe = new Stripe(process.env.PAY_SECRET);

export async function POST(req) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const metadata = session.metadata;
    const paymentIntentId = session.payment_intent;

    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;

    const orderData = {
      order_id: orderId,
      user_id: metadata.userId,
      email: metadata.email,
      product_id: metadata.productId,
      product_name: metadata.productName,
      quantity: parseInt(metadata.quantity || "1"),
      price: parseFloat(metadata.price),
      payment_intent_id: paymentIntentId,
      payment_status: session.payment_status || "paid",
      order_status: "processing", // default
    };

    const { data, error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Order Save Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const supabase =  createServerClientWithCookies();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Authenticated UID:", user?.id);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Auth User ID:", user.id);


    const { data: systemUser } = await supabase
      .from('system_users')
      .select('id, role_id')
      .eq('id', user.id)
      .single();

    const selectQuery = `
      *,
      productId:product_id (
        name,
        image,
        price,
        description,
        category
      )
    `;

    let orders;

    if (systemUser) {
  
      const { data, error } = await supabase.from('orders').select(selectQuery);
      if (error) throw error;
      orders = data;
    } else {
   
      const { data: normalUser ,error: userErr } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

        console.log("Normal user:", normalUser, "Error:", userErr);


      if (!normalUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const { data, error } = await supabase
        .from('orders')
        .select(selectQuery)
        .eq('user_id', user.id);

      if (error) throw error;
      orders = data;
    }

    console.log("systemUser:", systemUser);
    console.log("Fetched orders:", orders);

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('API error in /api/orders:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}