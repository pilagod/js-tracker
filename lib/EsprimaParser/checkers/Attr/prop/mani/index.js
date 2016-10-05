const criteria = require('./criteria')
const propManiChecker = require('../../../helpers/propManiChecker')

module.exports = ({callee}) => {
  return propManiChecker({criteria, callee})
}
