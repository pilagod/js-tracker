const createCallDispatcher = require('../createCallDispatcher')
const workDir = '../../checkers/HTMLElement/call'

module.exports = createCallDispatcher([
  require(workDir + '/event'),
  require(workDir + '/mani')
])
