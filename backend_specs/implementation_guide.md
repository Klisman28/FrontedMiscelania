# SaaS Implementation Guide (Backend)

This document outlines the required backend changes to support SaaS with Stripe.

## 1. Database Schema (Postgres / Sequelize)

### `companies` Table (Update)
Ensure the following fields exist:
- `id` (Primary Key)
- `stripe_customer_id` (String, nullable) - Stores the Stripe Customer ID
- `subscription_status` (Enum: 'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired') - For quick access without joining.

### New Tables

#### `plans` table
Stores available subscription plans.

```sql
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  interval VARCHAR(50) NOT NULL CHECK (interval IN ('month', 'year')),
  stripe_price_id VARCHAR(255) NOT NULL UNIQUE,
  seats_included INTEGER NOT NULL DEFAULT 1,
  seat_price DECIMAL(10, 2) NOT NULL, -- Informational only, controlled by Stripe Price
  features JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `subscriptions` table
Tracks the active subscription for each company.

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  plan_id INTEGER REFERENCES plans(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL, -- active, past_due, canceled, etc.
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  seats_purchased INTEGER DEFAULT 1,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `payments` table (Optional log)
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  stripe_event_id VARCHAR(255),
  amount DECIMAL(10, 2),
  currency VARCHAR(10),
  status VARCHAR(50), -- succeeded, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Backend Routes (Express.js Example)

### Dependencies
```bash
npm install stripe
```

### Route: `POST /api/v1/saas/checkout`
Creates a Stripe Checkout Session for subscription.

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/v1/saas/checkout', authMiddleware, async (req, res) => {
  const { planId, seats } = req.body;
  const company = req.company; // From authMiddleware

  // Get plan details
  const plan = await Plan.findByPk(planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  // Get or Create Stripe Customer
  let customerId = company.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      metadata: { companyId: company.id }
    });
    customerId = customer.id;
    await company.update({ stripe_customer_id: customerId });
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripe_price_id,
        quantity: seats, // Base price per seat if structured that way, OR base price + (seats-included) * seat_price
        // NOTE: Standard SaaS usually creates a subscription with a quantity = seats.
        // Assuming Stripe Price assumes "per seat" pricing model.
      },
    ],
    metadata: {
      companyId: company.id,
      planId: plan.id,
      seats: seats
    },
    success_url: `${process.env.FRONTEND_URL}/saas/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/saas/plans`,
  });

  return res.json({ url: session.url });
});
```

### Route: `POST /api/v1/saas/portal`
Opens the Stripe Customer Portal for managing the subscription.

```javascript
app.post('/api/v1/saas/portal', authMiddleware, async (req, res) => {
  const company = req.company;
  if (!company.stripe_customer_id) {
    return res.status(400).json({ error: 'No active subscription found.' });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: company.stripe_customer_id,
    return_url: `${process.env.FRONTEND_URL}/saas/billing`,
  });

  return res.json({ url: session.url });
});
```

### Route: `POST /api/v1/webhooks/stripe`
Handles Stripe events to keep DB in sync.

```javascript
app.post('/api/v1/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const companyId = session.metadata.companyId;
      const planId = session.metadata.planId;
      const subscriptionId = session.subscription;
      
      // Update DB: Create subscription record
      await Subscription.create({
         company_id: companyId,
         plan_id: planId,
         stripe_subscription_id: subscriptionId,
         status: 'active',
         seats_purchased: session.metadata.seats || 1,
         current_period_start: new Date(), // Simplified, get real dates from subscription object
         current_period_end: new Date() // Simplified
      });
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      // Sync status, dates, seats
      await Subscription.update({
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
        seats_purchased: subscription.items.data[0].quantity
      }, { where: { stripe_subscription_id: subscription.id } });
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await Subscription.update({ status: 'canceled' }, { where: { stripe_subscription_id: subscription.id } });
      break;
    }
  }

  res.json({received: true});
});
```

## 3. Middleware / Guards

### `subscriptionGuard`
Checks if the company has an active subscription.

```javascript
const subscriptionGuard = async (req, res, next) => {
  const company = req.company; // Populated by auth middleware
  
  // Or check cached status on company record
  if (!['active', 'trialing'].includes(company.subscription_status)) {
     // Check graceful period or if past_due is allowed temporarily
     return res.status(403).json({ error: 'Subscription required.', code: 'SUBSCRIPTION_EXPIRED' });
  }

  next();
};
```

### `seatsGuard`
Checks if the company has exceeded their seat limit when adding users.

```javascript
const seatsGuard = async (req, res, next) => {
  const company = req.company;
  const currentUsers = await User.count({ where: { company_id: company.id, active: true } });
  
  // Get seat limit from subscription
  const subscription = await Subscription.findOne({ where: { company_id: company.id } });
  const limit = subscription ? subscription.seats_purchased : 1; // Default 1 for free tier/trial

  if (currentUsers >= limit) {
    return res.status(409).json({ error: 'Seat limit reached. Please upgrade your plan.', code: 'SEATS_EXCEEDED' });
  }

  next();
};
```
