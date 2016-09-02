const createCallDispatcher = require('../createCallDispatcher')

/* browserify can't resolve dynamic path */
module.exports = createCallDispatcher([
  require('../../checkers/HTMLElement/call/event'),
  require('../../checkers/HTMLElement/call/mani')
])
