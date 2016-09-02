const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.jQuery && caller instanceof context.jQuery
}
module.exports = new Dispatcher([
  require('./callDispatcher')
], test)
