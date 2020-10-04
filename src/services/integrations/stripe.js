const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY, stripeOptions)

async function createCheckoutSession(lineItems) {
  const payload = checkoutSessionCreationPayload(lineItems)
  return await stripe.checkout.sessions.create(payload)
}

async function checkoutSession(sessionId) {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

function checkoutSessionCreationPayload(lineItems) {
  return {
    payment_method_types: process.env.PAYMENT_METHOD_TYPES.split(','),
    line_items: lineItems,
    payment_intent_data: {
      capture_method: 'manual',
    },
    shipping_address_collection: {
      allowed_countries: process.env.SHIPPING_ADDRESS_ALLOWED_COUNTRIES.split(',')
    },
    allow_promotion_codes: process.env.ALLOW_PROMOTION_CODES || false,
    success_url: `${process.env.DOMAIN}/${process.env.SUCCESS_URL_PATH}`,
    cancel_url: `${process.env.DOMAIN}/${process.env.CANCEL_URL_PATH}`
  }
}

function stripeOptions() {
  const options = {}

  if (process.env.STRIPE_MAX_NETWORK_RETRIES) {
    options.maxNetworkRetries = process.env.STRIPE_MAX_NETWORK_RETRIES
  }

  if (process.env.STRIPE_TIMEOUT) {
    options.timeout = process.env.STRIPE_TIMEOUT
  }

  return options
}

module.exports = {
  createCheckoutSession,
  checkoutSession
}
