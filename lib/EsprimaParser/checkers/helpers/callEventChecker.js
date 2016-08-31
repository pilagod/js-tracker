const Collection = require('../../structures/Collection')

module.exports = ({criteria, callee, statusData}) => {
  if (criteria.hasOwnProperty(callee.method)) {
    return Object.assign({type: Collection.EVENT}, statusData)
  }
  return undefined
}
