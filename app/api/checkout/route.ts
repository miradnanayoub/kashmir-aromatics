import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { billing, line_items, payment_method } = body;

    // 1. Construct the Order Payload for WooCommerce
    const data = {
      payment_method: payment_method, // 'cod' or 'razorpay'
      payment_method_title: payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      set_paid: false,
      billing: billing,
      shipping: billing, // Assuming shipping address same as billing for now
      line_items: line_items,
      status: "processing", // Or 'pending'
    };

    // 2. Send to WordPress
    const response = await api.post("orders", data);

    // 3. Return the Order ID to the frontend
    return NextResponse.json({ 
      success: true, 
      orderId: response.data.id, 
      orderKey: response.data.order_key 
    });

  } catch (error: any) {
    console.error("WooCommerce API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to create order. Please check your details." },
      { status: 500 }
    );
  }
}