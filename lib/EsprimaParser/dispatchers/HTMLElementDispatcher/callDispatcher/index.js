const Dispatcher = require('../../../structures/Dispatcher')
const Callee = require('../../../structures/Callee')

const test = ({callee}) => {
  return callee instanceof Callee
}
module.exports = new Dispatcher({
  path: `${__dirname}/checkers`
}, test)
