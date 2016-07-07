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

  VariableDeclarator(variableDeclarator) {
    this.closureStack.set(
      variableDeclarator.id.name,
      variableDeclarator.init ?
        this.parseNode(variableDeclarator.init) : undefined
    )
  }

  ThisExpression() {
    return this.closureStack.get('this')
  }

  ArrayExpression(arrayExpression) {
    const result = []
    arrayExpression.elements.forEach((node) => {
      result.push(this.parseNode(node))
    })
    return result
  }

  ObjectExpression(objectExpression) {
    const result = {}
    objectExpression.properties.forEach((node) => {
      const property = this.parseNode(node)
      result[property.key] = property.value
    })
    return result
  }

  Property(property) {
    return {
      key: this.getPropertyKeyOfString(property.key, property.computed),
      value: this.parseNode(property.value)
    }
  }

  getPropertyKeyOfString(key, computed) {
    return `${this.getPropertyKeyOfValue(key, computed)}`
  }

  getPropertyKeyOfValue(key, computed) {
    if (computed) {
      return this.parseNode(key)
    }
    return key.name || key.value
  }
}

module.exports = EsprimaParser
