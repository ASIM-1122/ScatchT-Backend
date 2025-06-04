// controllers/stripeController.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Keep your key in .env

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, userId } = req.body;

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amount in cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      metadata: {
        userId,
        productIds: items.map((item) => item._id).join(','),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
