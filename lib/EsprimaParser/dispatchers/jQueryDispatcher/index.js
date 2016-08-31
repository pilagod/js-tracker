const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.jQuery && caller instanceof context.jQuery
}
module.exports = new Dispatcher({
  path: __dirname,
  options: {regexp: /Dispatcher.js$/}
}, test)
