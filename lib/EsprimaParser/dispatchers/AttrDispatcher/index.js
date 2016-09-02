const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.Attr && caller instanceof context.Attr
}
module.exports = new Dispatcher([
  require('./propDispatcher')
], test)
