'use strict'

const unaryOperator = require('./operators/UnaryOperator')

class EsprimaParser {
  constructor() {
    this.closureStack = {}

    // set operator
    this.unaryOperator = unaryOperator
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

  UnaryExpression(unaryExpression) {
    const unaryOperation = this.unaryOperator[unaryExpression.operator]
    if (unaryExpression.operator === 'delete') {
      return this.handleDeleteUnaryOperation(unaryExpression.argument, unaryOperation)
    }
    return this.handleOtherUnaryOperation(unaryExpression.argument, unaryOperation)
  }

  handleOtherUnaryOperation(argument, unaryOperation) {
    return unaryOperation(this.parseNode(argument))
  }

  handleDeleteUnaryOperation(argument, deleteOperation) {
    if (argument.type === 'Identifier') {
      const windowReference = this.closureStack.get('window')
      return deleteOperation(windowReference, argument.name)
    } else if (argument.type === 'MemberExpression') {
      const expression = this.parseMemberExpression(argument)
      const expressionReference = expression.getReference()
      return deleteOperation(expressionReference.object, expressionReference.property)
    }
    return true
  }

  parseMemberExpression() {
  }
}

module.exports = EsprimaParser
