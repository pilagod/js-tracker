const Collection = require('../../structures/Collection')

module.exports = ({criteria, callee, statusData}) => {
  if (criteria.hasOwnProperty(callee.method) && callee.arguments.length === 1) {
    return Object.assign({type: Collection.MANIPULATION}, statusData)
  }
  return undefined
}
