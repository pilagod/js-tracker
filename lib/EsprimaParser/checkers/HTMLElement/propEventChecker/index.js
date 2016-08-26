const { Collection } = require('../../init-helper')
const CONSTANTS = require('./constants')

module.exports = ({callee}) => {
  if (CONSTANTS.hasOwnProperty(callee)) {
    return {
      type: Collection.EVENT
    }
  }
  return undefined
}
