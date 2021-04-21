const stripe = rootRequire('services/integrations/stripe')
const order = rootRequire('services/order')
const HttpError = rootRequire('services/error/http')

exports.name = 'order'
exports.httpMethod = 'post'
exports.rawPayloadParsing = true
exports.payloadParserOptions = { type: 'application/json' }

exports.action = async (req, res) => {
  try {
    const checkoutSession = stripe.completedCheckoutSession(req.body, req.headers)
    await order.create(checkoutSession.id)

    res.sendStatus(200)
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.code).send(err.message)
    }

    console.error(err)
    res.sendStatus(500)
  }
}
