const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({caller, callee}) => {
  const statusData = {
    execute: caller,
    passive: callee.arguments[0]
  }
  return callManiChecker({criteria, callee, statusData})
}
