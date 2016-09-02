const createCallDispatcher = require('../createCallDispatcher')

/* browserify can't resolve dynamic path */
module.exports = createCallDispatcher([
  require('../../checkers/DOMTokenList/call/mani')
])
