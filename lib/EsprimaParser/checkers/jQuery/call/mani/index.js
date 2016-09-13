const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({caller, callee}) => {
  return callManiChecker({criteria, callee})
}
