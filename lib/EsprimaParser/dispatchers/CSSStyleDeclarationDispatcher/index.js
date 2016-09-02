const Collection = require('../../structures/Collection')

module.exports = ({context, caller}) => {
  const style = context.CSSStyleDeclaration

  if (!!style && caller instanceof style) {
    return {
      type: Collection.MANIPULATION
    }
  }
  return undefined
}
