const createCallDispatcher = require('../createCallDispatcher')
const workDir = '../../checkers/jQuery/call'

/* browserify can't resolve dynamic path */
module.exports = createCallDispatcher([
  require('../../checkers/jQuery/call/event'),
  require('../../checkers/jQuery/call/eventArgge1'),
  require('../../checkers/jQuery/call/mani'),
  require('../../checkers/jQuery/call/maniArg0'),
  require('../../checkers/jQuery/call/maniArg1'),
  require('../../checkers/jQuery/call/maniArg2Object'),
  require('../../checkers/jQuery/call/maniPassive')
])
