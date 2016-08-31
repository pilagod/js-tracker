const CONSTANTS = require('./constants')
const Collection = require('../../../../../structures/Collection')

module.exports = ({callee}) => {
  if (CONSTANTS.hasOwnProperty(callee)) {
    return {
      type: Collection.MANIPULATION
    }
  }
  return undefined
}
