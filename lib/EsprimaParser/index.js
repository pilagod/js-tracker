'use strict'

class EsprimaParser {
  constructor() {
    this.closureStack = {}
  }

  /*************************/
  /*        Parsers        */
  /*************************/

  Identifier(identifier) {
    if (identifier.name === 'null') {
      return null
    } else if (identifier.name === 'undefined') {
      return undefined
    }
    return this.closureStack.get(identifier.name)
  }

  Literal(literal) {
    if (literal.regex) {
      return new RegExp(literal.regex.pattern, literal.regex.flags)
    }
    return literal.value
  }

  ThisExpression(thisExpression) {
    return this.closureStack.get('this')
  }
}

module.exports = EsprimaParser
