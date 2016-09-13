const criteria = require('./criteria')
const callManiArg2ObjectChecker = require('../../../helpers/callManiArg2ObjectChecker')

module.exports = ({caller, callee}) => {
  return callManiArg2ObjectChecker({criteria, callee})
}
