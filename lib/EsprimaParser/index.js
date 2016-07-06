'use strict'

class EsprimaParser {
  constructor() {
    this.closureStack = {}
  }

  /*************************/
  /*        Parsers        */
  /*************************/

  parseNode() {
  }

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

  Program(program) {
    program.body.forEach((node) => {
      this.parseNode(node)
    })
  }

  ExpressionStatement(expressionStatement) {
    this.parseNode(expressionStatement.expression)
  }

  VariableDeclaration(variableDeclaration) {
    variableDeclaration.declarations.forEach((node) => {
      this.parseNode(node)
    })
  }

  ThisExpression() {
    return this.closureStack.get('this')
  }
}

module.exports = EsprimaParser
