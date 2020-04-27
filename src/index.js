const core = require('./bootstrap')

core.routes.init(core.app, core.express)
core.app.listen(process.env.PORT)
