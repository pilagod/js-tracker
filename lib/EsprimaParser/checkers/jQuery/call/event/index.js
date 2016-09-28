const criteria = require('./criteria')
const callEventChecker = require('../../../helpers/callEventChecker')

module.exports = ({caller, callee}) => {
  return callEventChecker({criteria, callee})
}
