const express = require('express')
const fs = require('fs')
const cors = require('cors')

const router = express()

function run() {
  init()
  router.listen(process.env.PORT)
}

function init() {
  router.use(cors({ origin: true }))
  router.use(express.urlencoded({ extended: true }))

  setRoutes()
}

function setRoutes() {
  fs.readdirSync(srcPath('services/routes')).forEach(route => { setRoute(route) })
}

function setRoute(routeName) {
  const route = rootRequire(`services/routes/${routeName}`)
  router[route.httpMethod](`/${route.name}`, routeCallbacks(route), route.action)
}

function routeCallbacks(route) {
  const callbacks = []

  switch (true) {
    case route.jsonPayloadParsing:
      callbacks.push(express.json())
      break
    case route.rawPayloadParsing:
      callbacks.push(express.raw(route.payloadParserOptions))
      break
  }

  return route.callbacks ? [...callbacks, ...route.callbacks] : callbacks
}

module.exports = {
  run
}
