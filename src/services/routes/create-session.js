const routeName = 'create-session'
let stripe

function setRoute(app, stripeObject) {
  stripe = stripeObject
  app.post(`/${routeName}`, routeHandler)
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
