const stripe = rootRequire('services/integrations/stripe')
const lineItems = rootRequire('services/checkout/line-items')

async function create(lineItemsData, metadata = {}) {
  lineItemsData = await lineItems.processedLineItems(lineItemsData)
  return await stripe.createCheckoutSession(lineItemsData, metadata)
}

module.exports = {
  create
}
