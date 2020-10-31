const CheckoutSession = rootRequire('models/checkout/session')
const stripe = rootRequire('services/integrations/stripe')

const sessionExpandedData = [
  'line_items.data.price.product',
  'payment_intent',
  'total_details.breakdown.discounts'
]

class ExistingSession extends CheckoutSession {
  constructor(sessionId, expandedData = sessionExpandedData) {
    expandedData = Array.isArray(expandedData) ? expandedData : []

    super(sessionId, expandedData)

    this.sessionId = sessionId
    this.expandedData = expandedData
  }

  async init() {
    const session = await stripe.checkoutSession(this.sessionId, this.expandedData)
    this.assignSession(session)

    return this
  }
}

module.exports = ExistingSession
