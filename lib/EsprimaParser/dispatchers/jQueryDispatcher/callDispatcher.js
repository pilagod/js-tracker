const createCallDispatcher = require('../createCallDispatcher')
const workDir = '../../checkers/jQuery/call'

module.exports = createCallDispatcher([
  require(workDir + '/event'),
  require(workDir + '/eventArgge1'),
  require(workDir + '/mani'),
  require(workDir + '/maniArg0'),
  require(workDir + '/maniArg1'),
  require(workDir + '/maniArg2Object'),
  require(workDir + '/maniPassive')
])
