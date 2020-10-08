const stripe = rootRequire('services/integrations/stripe')
const order = rootRequire('services/order')

const routeName = 'order'

function setRoute(app, express) {
  app.post(`/${routeName}`, express.raw({ type: "application/json" }), routeHandler)
}

async function routeHandler(req, res) {
  let event

  try {
    event = stripe.constructWebhookEvent(
      req.body,
      req.headers,
      process.env.STRIPE_ORDER_CREATE_WEBHOOK_SECRET
    )

    if (event.type !== 'checkout.session.completed') {
      return res.sendStatus(403)
    }
  } catch (err) {
    console.error(err)
    return res.status(400).send('Webhook signature verification failed.')
  }

  try {
    const checkoutSession = stripe.webhookEventData(event)
    await order.create(checkoutSession.id)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

module.exports = {
  setRoute
}
