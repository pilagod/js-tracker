const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.HTMLElement && caller instanceof context.HTMLElement
}
module.exports = new Dispatcher([
  require('./callDispatcher'),
  require('./propDispatcher')
], test)
