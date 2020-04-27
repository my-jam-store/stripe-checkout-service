const routeName = 'get-session'
let stripe

function setRoute(app, stripeObject) {
  stripe = stripeObject
  app.get(`/${routeName}`, routeHandler)
}

async function routeHandler(req, res) {
  const { session_id } = req.query

  try {
    const session = await stripe.checkoutSession(session_id)
    res.send(session)
  } catch (err) {
    res.status(500).send('An error has occurred. Please contact the website administrator.')
  }
}

module.exports = {
  setRoute
}
