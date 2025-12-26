import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, reviewer, email, rating, content } = body;

    // Validate required fields
    if (!productId || !reviewer || !email || !rating || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const url = `${process.env.WORDPRESS_SITE_URL}/wp-json/wc/v3/products/reviews`;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${consumerKey}:${consumerSecret}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        product_id: productId,
        reviewer: reviewer,
        reviewer_email: email,
        review: content,
        rating: rating,
        verified: false, // Set to true if you implement login later
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('WooCommerce Review Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to submit review' }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Review API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}