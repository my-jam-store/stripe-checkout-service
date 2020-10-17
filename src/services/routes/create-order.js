const stripe = rootRequire('services/integrations/stripe')
const order = rootRequire('services/order')

const routeName = 'order'

function setRoute(app, express) {
  app.post(`/${routeName}`, express.raw({ type: 'application/json' }), routeHandler)
}

async function routeHandler(req, res) {
  try {
    const checkoutSession = stripe.completedCheckoutSession(req.body, req.headers)
    await order.create(checkoutSession.id)

    res.sendStatus(200)
  } catch (err) {
    if (err.name === 'HttpError') {
      return res.status(err.code).send(err.message)
    }

    console.error(err)
    res.sendStatus(500)
  }
}

module.exports = {
  setRoute
}
