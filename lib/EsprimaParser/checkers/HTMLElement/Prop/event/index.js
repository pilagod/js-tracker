const criteria = require('./criteria')
const propEventChecker = require('../../../helpers/propEventChecker')

module.exports = ({callee}) => {
  return propEventChecker({criteria, callee})
}
