const Collection = require('../../structures/Collection')

const isArg2Object = (callee) => {
  return callee.arguments.length === 2 ||
    ((!!callee.arguments[0]) && callee.arguments[0].constructor === Object)
}
module.exports = ({criteria, callee}) => {
  if (criteria.hasOwnProperty(callee.method) && isArg2Object(callee)) {
    return {
      type: Collection.MANIPULATION
    }
  }
  return undefined
}
