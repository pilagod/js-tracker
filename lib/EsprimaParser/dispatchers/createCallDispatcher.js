const Callee = require('../structures/Callee')
const Dispatcher = require('../structures/Dispatcher')
const test = ({callee}) => callee instanceof Callee

module.exports = (handlers) => new Dispatcher(handlers, test)
