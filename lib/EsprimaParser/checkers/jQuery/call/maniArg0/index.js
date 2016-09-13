const criteria = require('./criteria')
const callManiArg0Checker = require('../../../helpers/callManiArg0Checker')

module.exports = ({caller, callee}) => {
  return callManiArg0Checker({criteria, callee})
}
