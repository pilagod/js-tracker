const { Collection } = require('../init-helper')

module.exports = {
  dispatch: ({context, caller}) => {
    if (caller instanceof context.CSSStyleDeclaration) {
      return {
        type: Collection.MANIPULATION
      }
    }
    return undefined
  }
}
