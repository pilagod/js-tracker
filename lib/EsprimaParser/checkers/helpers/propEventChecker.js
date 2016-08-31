const Collection = require('../../structures/Collection')

module.exports = ({criteria, callee, statusData}) => {
  if (criteria.hasOwnProperty(callee)) {
    return Object.assign({type: Collection.EVENT}, statusData)
  }
  return undefined
}
