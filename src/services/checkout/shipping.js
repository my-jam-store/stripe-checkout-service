const lineItems = rootRequire('services/checkout/line-items')

async function shippingRateIds(lineItemsData) {
  if (!isEnabled()) {
    return []
  }

  const subtotal = await lineItems.calculateSubtotal(lineItemsData)
  const shippingId = !isFreeShipping(subtotal)
    ? process.env.STRIPE_SHIPPING_FEE_ID : process.env.STRIPE_FREE_SHIPPING_ID

  return [shippingId]
}

function isEnabled() {
  return process.env.SHIPPING_ENABLED === 'true'
    && (process.env.STRIPE_SHIPPING_FEE_ID || process.env.STRIPE_FREE_SHIPPING_ID)
}

function isFreeShipping(subtotal) {
  return subtotal >= process.env.FREE_SHIPPING_SUBTOTAL
}

module.exports = {
  shippingRateIds
}
