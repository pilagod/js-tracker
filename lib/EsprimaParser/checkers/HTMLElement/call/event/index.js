const criteria = require('./criteria')
const callEventChecker = require('../../../helpers/callEventChecker')

module.exports = ({callee}) => {
  return callEventChecker({criteria, callee})
}
