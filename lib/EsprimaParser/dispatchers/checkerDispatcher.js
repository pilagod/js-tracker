const Dispatcher = require('../structures/Dispatcher')

module.exports = new Dispatcher({
  path: __dirname,
  options: {file: false}
})
