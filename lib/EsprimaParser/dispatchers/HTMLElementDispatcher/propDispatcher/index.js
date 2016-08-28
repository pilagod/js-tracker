const Dispatcher = require('../../../structures/Dispatcher')

const test = ({callee}) => {
  return typeof callee === 'string'
}
module.exports = new Dispatcher({
  path: `${__dirname}/checkers`
}, test)
