const createCallDispatcher = require('../createCallDispatcher')
const workDir = '../../checkers/DOMTokenList/call'

module.exports = createCallDispatcher([
  require(workDir + '/mani')
])
