const criteria = require('./criteria')
const callManiChecker = require('../../../helpers/callManiChecker')

module.exports = ({context, caller, callee}) => {
  const status = callManiChecker({criteria, callee})

  if (status) {
    return Object.assign({}, status, {
      target: context.jQuery(callee.arguments[0])
    })
  }
  return undefined
}
