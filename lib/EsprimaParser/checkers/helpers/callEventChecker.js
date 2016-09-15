const Collection = require('../../structures/Collection')

module.exports = ({criteria, callee}) => {
  if (criteria.hasOwnProperty(callee.method)) {
    return {
      type: Collection.EVENT
    }
  }
  return undefined
}
