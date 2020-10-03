const stripe = rootRequire('services/integrations/stripe')

const routeName = 'session'

function setRoute(app, express) {
  app.post(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  try {
    const session = await stripe.createCheckoutSession(req.body)
    res.send({ sessionId: session.id })
  } catch (err) {
    console.error(err)
    res.status(500).send('An error has occurred. Please contact the website administrator.')
  }
}

module.exports = {
  setRoute
}
