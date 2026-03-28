import { NextResponse } from "next/server";
import Stripe from "stripe";
import { booksById } from "../../../lib/site-data";

export async function POST(request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  const { productId } = await request.json();
  const product = booksById[productId];

  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }

  const stripe = new Stripe(secretKey);
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled#store`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.price,
          product_data: {
            name: product.title,
            description: product.description,
            images: product.checkoutImage ? [`${origin}${product.checkoutImage}`] : []
          }
        }
      }
    ]
  });

  return NextResponse.json({ url: session.url });
}
