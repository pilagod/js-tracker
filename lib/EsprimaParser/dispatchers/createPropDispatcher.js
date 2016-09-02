const Dispatcher = require('../structures/Dispatcher')
const test = ({callee}) => typeof callee === 'string'

module.exports = (handlers) => new Dispatcher(handlers, test)
