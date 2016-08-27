const { Callee, Collection } = require('../../init-helper')
const CONSTANTS = require('../../HTMLElement/callEventChecker/constants')

module.exports = ({callee}) => {
  if (callee instanceof Callee && CONSTANTS.hasOwnProperty(callee.method)) {
    return {
      type: Collection.EVENT
    }
  }
  return undefined
}
