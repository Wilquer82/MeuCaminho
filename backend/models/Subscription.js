const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  planType: {
    type: String,
    enum: ['monthly', 'annual', 'lifetime'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'trialing'],
    default: 'active'
  },
  amountPaid: Number,
  currency: { type: String, default: 'brl' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  nextBillingDate: Date,
  canceledAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
