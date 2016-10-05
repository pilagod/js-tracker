const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({callee}) => {
  return callManiChecker({criteria, callee})
}
