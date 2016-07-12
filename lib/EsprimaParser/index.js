const escodegen = require('escodegen')

const Expression = require('./structures/Expression')

const unaryOperators = require('./operators/unaryOperators')
const binaryOperators = require('./operators/binaryOperators')
const logicalOperators = require('./operators/logicalOperators')

class EsprimaParser {
  constructor() {
    /* import libs */
    this.escodegen = escodegen

    /* import structures */
    this.Expression = Expression

    /* import operators */
    this.binaryOperators = binaryOperators
    this.logicalOperators = logicalOperators
    this.unaryOperators = this.initUnaryOperators(unaryOperators)
    this.assignmentOperators = this.initAssignmentOperators()

    /* init class variables */
    this.closureStack = {}
  }

  initUnaryOperators(importedUnaryOperators = {}) {
    return Object.assign({}, importedUnaryOperators, {
      'delete': ({object, property}) => {
        // default parameter can't be stubbed
        if (object === undefined) {
          object = this.closureStack.get('window')
        }
        return delete object[property]
      }
    })
  }

  initAssignmentOperators(importedAssignmentOperators = {}) {
    return Object.assign({}, importedAssignmentOperators, {
      '=': ({object, property}, value) => {
        // @TODO: check object style / classList / dom manipulation
        if (object === undefined) {
          this.closureStack.update(property, value)
        } else {
          object[property] = value
        }
      }
    })
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
      key: this.getPropertyAsString(property.key, property.computed),
      value: this.parseNode(property.value)
    }
  }

  getPropertyAsString(key, computed) {
    return `${this.getPropertyValue(key, computed)}`
  }

  getPropertyValue(key, computed) {
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
      return operation({
        property: argument.name
      }, ...args)
    } else if (['MemberExpression', 'CallExpression'].indexOf(argument.type) >= 0) {
      const expression = this.parseExpression(argument)
      const expressionReference = expression.getReference()

      return operation(expressionReference, ...args)
    }
    // @TODO: need to test outlier
    return undefined
  }

  handleOperation(argument, operation) {
    return operation(this.parseNode(argument))
  }

  parseExpression(node) {
    const expression = this[`parse${node.type}`](node)
    return new (this.Expression)(expression, {
      loc: node.loc,
      code: this.escodegen(node)
    })
  }

  parseMemberExpression(memberExpression) {
    const object = this.getObjectAsArray(
      memberExpression.object
    )
    const property = this.getPropertyAsString(
      memberExpression.property,
      memberExpression.computed
    )
    return [...object, property]
  }

  getObjectAsArray(object) {

  }

  parseCallExpression(node) {
  }

  UpdateExpression(updateExpression) {
    const transformedExpression = this.transformUpdateToAssignment(updateExpression)
    const newValue = this.AssignmentExpression(transformedExpression)

    return updateExpression.prefix ? newValue : this.parseNode(updateExpression.argument)
  }

  transformUpdateToAssignment(updateExpression) {
    const assignmentExpression = {
      type: 'AssignmentExpression',
      operator: `${updateExpression.operator[0]}=`,
      left: updateExpression.argument,
      right: {type: 'Literal', value: 1, raw: '1'}
    }
    return assignmentExpression
  }

  BinaryExpression(binaryExpression) {
    const left = this.parseNode(binaryExpression.left)
    const right = this.parseNode(binaryExpression.right)
    const binaryOperation = this.binaryOperators[binaryExpression.operator]

    return binaryOperation(left, right)
  }

  // @TODO: native style manipulation
  AssignmentExpression(assignmentExpression) {
    // @TODO: if right is already an call manipulation, it would record in CallExpression
    // @TODO: so we can check only left
    assignmentExpression.operator = assignmentExpression.operator.replace(/\=$/, '')
    const newValue = this.BinaryExpression(assignmentExpression)
    this.handleReferenceOperation(
      assignmentExpression.left,
      this.assignmentOperators['='],
      newValue
    )
    return newValue
  }

  LogicalExpression(logicalExpression) {
    const left = this.parseNode(logicalExpression.left)
    const right = this.parseNode(logicalExpression.right)
    const logicalOperation = this.logicalOperators[logicalExpression.operator]

    return logicalOperation(left, right)
  }

  MemberExpression(memberExpression) {
    const expression = this.parseExpression(memberExpression)
    return expression.execute()
  }

  ConditionalExpression(conditionalExpression) {
    const test = this.parseNode(conditionalExpression.test)
    if (test) {
      return this.parseNode(conditionalExpression.consequent)
    }
    return this.parseNode(conditionalExpression.alternate)
  }

  CallExpression(callExpression) {
    const expression = this.parseExpression(callExpression)
    return this.checkAndExecute(expression)
  }

  checkAndExecute(expression) {
  }

  SequenceExpression(sequenceExpression) {
    let result
    sequenceExpression.expressions.forEach((expression) => {
      result = this.parseNode(expression)
    })
    return result
  }
}

module.exports = EsprimaParser
