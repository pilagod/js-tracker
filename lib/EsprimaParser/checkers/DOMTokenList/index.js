const { Collection } = require('../init-helper')

module.exports = {
  dispatch({context, caller}) {
    if (caller instanceof context.DOMTokenList) {
      return {
        type: Collection.MANIPULATION,
        execute: undefined
      }
    }
    return undefined
  }
}
