const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.HTMLElement && caller instanceof context.HTMLElement
}
module.exports = new Dispatcher({
  path: __dirname,
  options: {regexp: /Dispatcher.js$/}
}, test)
