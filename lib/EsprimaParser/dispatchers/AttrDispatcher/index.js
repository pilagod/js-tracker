const Dispatcher = require('../../structures/Dispatcher')

const test = ({context, caller}) => {
  return !!context.Attr && caller instanceof context.Attr
}
module.exports = new Dispatcher({
  path: __dirname,
  options: {regexp: /Dispatcher.js$/}
}, test)
