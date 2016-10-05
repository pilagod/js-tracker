const createPropDispatcher = require('../createPropDispatcher')

/* browserify can't resolve dynamic path */
module.exports = createPropDispatcher([
  require('../../checkers/HTMLElement/prop/event'),
  require('../../checkers/HTMLElement/prop/mani')
])
