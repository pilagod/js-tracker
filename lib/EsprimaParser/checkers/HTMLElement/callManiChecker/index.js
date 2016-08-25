const { Callee, Collection } = require('../../init-helper')
const CONSTANTS = require('./constants')

module.exports = (data) => {
  const callee = data.callee

  if (callee instanceof Callee && CONSTANTS.hasOwnProperty(callee.method)) {
    return {
      type: Collection.MANIPULATION,
      execute: undefined
    }
  }
  return undefined
}
