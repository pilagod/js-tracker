const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({caller, callee}) => {
  const statusData = {
    execute: caller
  }
  return callManiChecker({criteria, callee, statusData})
}
