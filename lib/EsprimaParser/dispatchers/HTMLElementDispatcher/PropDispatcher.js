const createPropDispatcher = require('../createPropDispatcher')
const workDir = '../../checkers/HTMLElement/prop'

module.exports = createPropDispatcher([
  require(workDir + '/event'),
  require(workDir + '/mani')
])
