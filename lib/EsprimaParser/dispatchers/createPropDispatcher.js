const Dispatcher = require('../structures/Dispatcher')

module.exports = function ({path, options}) {
  const test = ({callee}) => typeof callee === 'string'

  return new Dispatcher({path, options}, test)
}
