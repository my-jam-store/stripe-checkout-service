setGlobals()
rootRequire('services/config/env')

const router = rootRequire('services/router')

function setGlobals() {
  const rootPath = process.cwd()

  global.rootRequire = name => require(`./${name}`)
  global.srcPath = file => `${__dirname}/${file}`
  global.configPath = file => `${rootPath}/config/${file}`
}

module.exports = {
  router
}
