const Collection = require('../../structures/Collection')

module.exports = ({criteria, callee}) => {
  if (criteria.hasOwnProperty(callee.method) && callee.arguments.length === 1) {
    return {
      type: Collection.MANIPULATION
    }
  }
  return undefined
}
