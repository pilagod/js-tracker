const Collection = require('../../structures/Collection')

module.exports = ({criteria, callee}) => {
  if (criteria.hasOwnProperty(callee)) {
    return {
      type: Collection.MANIPULATION
    }
  }
  return undefined
}
