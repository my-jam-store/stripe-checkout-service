const stripe = rootRequire('services/integrations/stripe')

const routeName = 'session'

function setRoute(app, express) {
  app.get(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  const { session_id } = req.query

  try {
    const session = await stripe.checkoutSession(session_id)
    res.send(session)
  } catch (err) {
    console.error(err)
    res.status(500).send('An error has occurred. Please contact the website administrator.')
  }
}

module.exports = {
  setRoute
}
