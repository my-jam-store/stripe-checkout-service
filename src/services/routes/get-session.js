const checkoutSession = rootRequire('services/checkout/session')

exports.name = 'session'
exports.httpMethod = 'get'

exports.action = async (req, res) => {
  const { session_id } = req.query

  try {
    const session = await checkoutSession.get(session_id)
    res.send(session)
  } catch (err) {
    console.error(err)
    res.status(500).send('An error has occurred. Please contact the website administrator.')
  }
}
