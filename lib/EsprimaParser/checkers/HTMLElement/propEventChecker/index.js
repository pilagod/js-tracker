const { Callee, Collection } = require('../../init-helper')
const CONSTANTS = require('./constants')

module.exports = (data) => {
  if (CONSTANTS.hasOwnProperty(data.callee)) {
    return {
      type: Collection.EVENT
    }
  }
  return undefined
}
