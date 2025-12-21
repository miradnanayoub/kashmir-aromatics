import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, email } = await request.json();

    if (!orderId || !email) {
      return NextResponse.json({ success: false, message: 'Order ID and Email are required.' }, { status: 400 });
    }

    const url = process.env.WORDPRESS_SITE_URL;
    const key = process.env.WC_CONSUMER_KEY;
    const secret = process.env.WC_CONSUMER_SECRET;

    // Call WooCommerce REST API securely from the server
    const response = await fetch(`${url}/wp-json/wc/v3/orders/${orderId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ success: false, message: 'Order not found. Please check the ID.' }, { status: 404 });
      }
      throw new Error('Failed to fetch order');
    }

    const order = await response.json();

    // SECURITY CHECK: Verify the email matches the order
    if (order.billing.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ success: false, message: 'Email does not match our records for this order.' }, { status: 403 });
    }

    // Return only the safe data
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        date: order.date_created,
        total: order.total,
        currency: order.currency_symbol,
        items: order.line_items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          total: item.total
        }))
      }
    });

  } catch (error) {
    console.error('Tracking Error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please try again later.' }, { status: 500 });
  }
}