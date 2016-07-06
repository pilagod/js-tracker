'use strict'

class EsprimaParser {
  constructor() {}

  /*************************/
  /*        Parsers        */
  /*************************/

  Literal(literal) {
    if (literal.regex) {
      return new RegExp(literal.regex.pattern, literal.regex.flags)
    }
    return literal.value
  }
}

module.exports = EsprimaParser
