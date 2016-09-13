const criteria = require('./criteria')
const callManiArg1Checker = require('../../../helpers/callManiArg1Checker')

module.exports = ({caller, callee}) => {
  return callManiArg1Checker({criteria, callee})
}
