const Callee = require('../structures/Callee')
const Dispatcher = require('../structures/Dispatcher')

module.exports = function ({path, options}) {
  const test = ({callee}) => callee instanceof Callee

  return new Dispatcher({path, options}, test)
}
