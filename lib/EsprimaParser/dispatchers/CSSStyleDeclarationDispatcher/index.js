const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.CSSStyleDeclaration && caller instanceof context.CSSStyleDeclaration
}
module.exports = new Dispatcher([
  require('./propDispatcher')
], test)
