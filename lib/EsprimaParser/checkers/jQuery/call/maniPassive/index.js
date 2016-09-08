const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({context, caller, callee}) => {
  const statusData = {
    execute: caller,
    passive: context.jQuery(callee.arguments[0])
  }
  return callManiChecker({criteria, callee, statusData})
}
