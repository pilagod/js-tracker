const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.DOMTokenList && caller instanceof context.DOMTokenList
}
module.exports = new Dispatcher([
  require('./callDispatcher')
], test)
