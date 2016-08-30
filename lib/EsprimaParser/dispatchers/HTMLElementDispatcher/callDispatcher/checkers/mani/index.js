const CONSTANTS = require('./constants')
const Collection = require('../../../../../structures/Collection')

module.exports = ({callee}) => {
  if (CONSTANTS.hasOwnProperty(callee.method)) {
    return {
      type: Collection.MANIPULATION,
      execute: undefined
    }
  }
  return undefined
}
