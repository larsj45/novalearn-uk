#!/usr/bin/env node
/**
 * Auditelle SASU - Stripe Products Setup
 * Usage: STRIPE_SECRET_KEY=sk_xxx node create-stripe-products.js
 */

const Stripe = require('stripe');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error('❌ Set STRIPE_SECRET_KEY environment variable');
  console.log('Usage: STRIPE_SECRET_KEY=sk_xxx node create-stripe-products.js');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY);

const products = [
  {
    name: 'Auditelle Pro',
    description: 'Pour enseignants et consultants - 1,000 analyses/mois',
    monthlyPrice: 2500, // €25 in cents
    annualPrice: 25000, // €250 in cents (17% discount)
    metadata: { tier: 'pro', analyses_per_month: '1000' }
  },
  {
    name: 'Auditelle Université',
    description: 'Pour établissements d\'enseignement - 10,000 analyses/mois',
    monthlyPrice: 14900, // €149
    annualPrice: 149000, // €1,490
    metadata: { tier: 'university', analyses_per_month: '10000' }
  },
  {
    name: 'Auditelle Enterprise',
    description: 'Pour organisations nationales - Analyses illimitées',
    monthlyPrice: 49900, // €499
    annualPrice: 499000, // €4,990
    metadata: { tier: 'enterprise', analyses_per_month: 'unlimited' }
  }
];

async function createProducts() {
  console.log('🚀 Creating Auditelle Stripe products...\n');
  
  const results = {
    products: [],
    prices: { monthly: {}, annual: {} }
  };

  for (const p of products) {
    console.log(`📦 Creating product: ${p.name}`);
    
    // Create product
    const product = await stripe.products.create({
      name: p.name,
      description: p.description,
      metadata: p.metadata
    });
    results.products.push(product);
    console.log(`   ✅ Product ID: ${product.id}`);

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: p.monthlyPrice,
      currency: 'eur',
      recurring: { interval: 'month' },
      metadata: { ...p.metadata, billing: 'monthly' }
    });
    results.prices.monthly[p.metadata.tier] = monthlyPrice.id;
    console.log(`   💰 Monthly: ${monthlyPrice.id} (€${p.monthlyPrice/100}/mois)`);

    // Create annual price
    const annualPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: p.annualPrice,
      currency: 'eur',
      recurring: { interval: 'year' },
      metadata: { ...p.metadata, billing: 'annual' }
    });
    results.prices.annual[p.metadata.tier] = annualPrice.id;
    console.log(`   📅 Annual: ${annualPrice.id} (€${p.annualPrice/100}/an)\n`);
  }

  console.log('═══════════════════════════════════════════════');
  console.log('✅ ALL PRODUCTS CREATED!\n');
  console.log('📋 Add these to your .env:\n');
  console.log(`STRIPE_PRO_PRICE_ID=${results.prices.monthly.pro}`);
  console.log(`STRIPE_UNIVERSITY_PRICE_ID=${results.prices.monthly.university}`);
  console.log(`STRIPE_ENTERPRISE_PRICE_ID=${results.prices.monthly.enterprise}`);
  console.log(`\n# Annual prices (optional):`);
  console.log(`STRIPE_PRO_ANNUAL_PRICE_ID=${results.prices.annual.pro}`);
  console.log(`STRIPE_UNIVERSITY_ANNUAL_PRICE_ID=${results.prices.annual.university}`);
  console.log(`STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=${results.prices.annual.enterprise}`);
  console.log('═══════════════════════════════════════════════');

  return results;
}

createProducts().catch(console.error);
