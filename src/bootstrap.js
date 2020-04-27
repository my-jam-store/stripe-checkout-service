setGlobals()
rootRequire('services/config/env')

const express = require('express')
const app = express()
const routes = rootRequire('services/routes')

function setGlobals() {
  const path = require('path')
  const rootPath = '/' + path.basename(path.dirname(__dirname))

  global.rootRequire = name => require(`./${name}`)
  global.srcPath = file => `${__dirname}/${file}`
  global.configPath = file => `${rootPath}/config/${file}`
}

module.exports = {
  app,
  express,
  routes
}
