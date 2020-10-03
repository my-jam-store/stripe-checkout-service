const stripe = rootRequire('services/integrations/stripe')
const lineItems = rootRequire('services/checkout/line-items')

async function createSession(lineItemsData) {
  lineItemsData = await lineItems.processedLineItems(lineItemsData)
  return await stripe.createCheckoutSession(lineItemsData)
}

module.exports = {
  createSession
}
