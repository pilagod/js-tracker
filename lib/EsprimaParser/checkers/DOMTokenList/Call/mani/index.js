const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({callee}) => {
  const statusData = {
    execute: undefined
  }
  return callManiChecker({criteria, callee, statusData})
}
