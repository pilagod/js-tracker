const Dispatcher = require('../structures/Dispatcher')

module.exports = new Dispatcher([
  require('./AttrDispatcher'),
  require('./CSSStyleDeclarationDispatcher'),
  require('./DOMTokenListDispatcher'),
  require('./HTMLElementDispatcher'),
  require('./jQueryDispatcher')
])
