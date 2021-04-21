const checkoutSession = rootRequire('services/checkout/session')

exports.name = 'session'
exports.httpMethod = 'post'
exports.jsonPayloadParsing = true

exports.action = async (req, res) => {
  try {
    const session = await checkoutSession.create(req.body.line_items, req.body.metadata)
    res.send({ sessionId: session.id })
  } catch (err) {
    console.error(err)
    res.status(500).send('An error has occurred. Please contact the website administrator.')
  }
}
