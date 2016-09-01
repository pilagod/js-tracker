const criteria = require('./criteria')
const callManiArg1Checker = require('../../../helpers/callManiArg1Checker')

module.exports = ({caller, callee}) => {
  const statusData = {
    execute: caller
  }
  return callManiArg1Checker({criteria, callee, statusData})
}
