const criteria = require('./criteria')
const callEventArgge1Checker = require('../../../helpers/callEventArgge1Checker')

module.exports = ({callee}) => {
  return callEventArgge1Checker({criteria, callee})
}
