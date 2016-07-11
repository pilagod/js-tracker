const unaryOperators = require('./operators/UnaryOperators')
const binaryOperators = require('./operators/BinaryOperators')

class EsprimaParser {
  constructor() {
    /* import structures */

    /* import operators */
    this.unaryOperators = Object.assign({}, unaryOperators, {
      'delete': ({
        object,
        property
      } = {
        object: this.closureStack.get('window'),
        property: null
      }) => delete object[property]
    })
    this.binaryOperators = binaryOperators

    /* init class variables */
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
      const {key, value} = this.parseNode(node)
      result[key] = value
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
    const unaryOperation = this.unaryOperators[unaryExpression.operator]
    if (unaryExpression.operator === 'delete') {
      return this.handleReferenceOperation(unaryExpression.argument, unaryOperation)
    }
    return this.handleOperation(unaryExpression.argument, unaryOperation)
  }

  handleReferenceOperation(argument, operation, ...args) {
    if (argument.type === 'Identifier') {
      return operation({property: argument.name}, ...args)
    } else if (['MemberExpression', 'CallExpression'].indexOf(argument.type) >= 0) {
      const expression = this[`parse${argument.type}`](argument)
      const expressionReference = expression.getReference()

      return operation(expressionReference, ...args)
    }
  }

  handleOperation(argument, operation) {
    return operation(this.parseNode(argument))
  }

  BinaryExpression(binaryExpression) {
    const left = this.parseNode(binaryExpression.left)
    const right = this.parseNode(binaryExpression.right)
    const binaryOperation = this.binaryOperators[binaryExpression.operator]

    return binaryOperation(left, right)
  }

  AssignmentExpression(assignmentExpression) {
    assignmentExpression.operator = assignmentExpression.operator.replace(/\=$/, '')
    const newValue = this.BinaryExpression(assignmentExpression)

    this.handleAssignment(assignmentExpression.left, newValue)

    return newValue
  }

  handleAssignment(left, newValue) {
  }

  parseMemberExpression() {
  }

  parseCallExpression() {
  }
}

module.exports = EsprimaParser
