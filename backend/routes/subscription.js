const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

const PLANS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual: process.env.STRIPE_PRICE_ANNUAL,
  lifetime: process.env.STRIPE_PRICE_LIFETIME
};

// 1. Criar sessão de checkout Stripe
router.post('/checkout', auth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe não configurado neste ambiente' });
    }

    const { planType } = req.body;
    const priceId = PLANS[planType];

    if (!priceId) {
      return res.status(400).json({ message: 'Plano inválido' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: planType === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${process.env.FRONTEND_URL}/premium/sucesso`,
      cancel_url: `${process.env.FRONTEND_URL}/premium/cancelado`,
      client_reference_id: req.user._id.toString(),
      metadata: { planType, userId: req.user._id.toString() }
    });

    res.json({ url: session.url, sessionId: session.id });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Webhook Stripe (confirma pagamento)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json({ message: 'Webhook Stripe não configurado neste ambiente' });
    }

    const event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, planType } = session.metadata;

      const user = await User.findById(userId);
      user.plan = planType === 'lifetime' ? 'lifetime' : 'premium';
      user.subscriptionId = session.subscription || session.payment_intent;

      if (planType !== 'lifetime') {
        user.subscriptionExpires = new Date();
        user.subscriptionExpires.setMonth(
          user.subscriptionExpires.getMonth() + (planType === 'annual' ? 12 : 1)
        );
      }

      await user.save();

      await Subscription.create({
        user: userId,
        stripeSubscriptionId: session.subscription || session.payment_intent,
        planType,
        status: 'active',
        amountPaid: session.amount_total / 100,
        currency: session.currency
      });

      console.log(`✅ Usuário ${userId} atualizado para ${user.plan}`);
    }

    res.json({ received: true });

  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// 3. Cancelar assinatura
router.post('/cancel', auth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe não configurado neste ambiente' });
    }

    const user = await User.findById(req.user._id);

    if (user.subscriptionId && user.plan === 'premium') {
      await stripe.subscriptions.del(user.subscriptionId);
      user.plan = 'free';
      user.subscriptionId = null;
      user.subscriptionExpires = null;
      await user.save();
    }

    res.json({ success: true, message: 'Assinatura cancelada com sucesso' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Verificar status da assinatura
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      plan: user.plan,
      isPremium: user.isPremium(),
      subscriptionExpires: user.subscriptionExpires
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
