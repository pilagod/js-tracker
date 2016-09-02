const createPropDispatcher = require('../createPropDispatcher')
const workDir = '../../checkers/Attr/prop'

module.exports = createPropDispatcher([
  require(workDir + '/mani')
])
