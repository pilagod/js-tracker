const criteria = require('./criteria')
const callEventArg1Checker = require('../../../helpers/callEventArg1Checker')

module.exports = ({callee}) => {
  return callEventArg1Checker({criteria, callee})
}
