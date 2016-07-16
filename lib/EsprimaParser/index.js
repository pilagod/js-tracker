const escodegen = require('escodegen')

const Expression = require('./structures/Expression')
const Status = require('./structures/Status')

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

    /* status */
    this.status = new Status()
    // this.isReturnStatus = false // function
    // this.isBreakStatus = false // switch, loop, label
    // this.isContinueStatus = false // loop, label

    /* variables */
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

  /*************************/
  /*       Statements      */
  /*************************/

  ExpressionStatement(expressionStatement) {
    this.parseNode(expressionStatement.expression)
  }

  BlockStatement(blockStatement) {
    // @TODO: create and push new block scope to closureStack
    const result = this.parseStatementBody(blockStatement.body)
    // @TODO: pop block scope from closureStack
    return result
  }

  parseStatementBody(body) {
    // @TODO: should not only return when encouter explicit statement
    // @TODO: no value could mean a return / break / continue, except returning undefined
    let result

    for (const node of body) {
      result = this.parseNode(node)
      // has problem here
      // @TODO: how to detect undefined return ?
      // @TODO: return statement only occurs in function, unset in parseFunction ?
      if (this.isFlowControlStatement(node.type)) {
        break
      }
    }
    return result
  }

  isFlowControlStatement(type) {
    switch (type) {
      case 'ReturnStatement':
      case 'ContinueStatement':
      case 'BreakStatement':
        return true

      default:
        return false
    }
  }

  EmptyStatement() {
  }

  ReturnStatement(returnStatement) {
    this.status.set('return')

    return returnStatement.argument ?
      this.parseNode(returnStatement.argument) : undefined
  }

  BreakStatement() {
    this.status.set('break')
  }

  ContinueStatement() {
    this.status.set('continue')
  }

  IfStatement(ifStatement) {
    const testPass = this.parseNode(ifStatement.test)
    // those statement(s) in IfStatement might contain flow control statement,
    // IfStatement should return signal to caller
    if (testPass) {
      return this.parseNode(ifStatement.consequent)
    }
    return this.parseNode(ifStatement.alternate)
  }

  SwitchStatement(switchStatement) {
    const discriminant = this.parseNode(switchStatement.discriminant)

    return this.parseSwitchCases(switchStatement.cases, discriminant)
  }

  parseSwitchCases(switchCases, discriminant) {
    let result

    for (const [matchedIndex, switchCase] of switchCases.entries()) {
      const matched = this.isTestMatchDiscriminant(
        switchCase.test,
        discriminant
      )
      if (matched) {
        result = this.parseMatchedCase(switchCases, matchedIndex)
        break
      }
    }
    return result
  }

  isTestMatchDiscriminant(caseTestExpression, discriminant) {
    if (caseTestExpression === null) {
      // default case
      return true
    }
    return (
      this.parseNode(caseTestExpression) === discriminant
    )
  }

  parseMatchedCase(switchCases, matchedIndex) {
    // matched case might be empty and combined together with consequent cases
    const firstNonEmptyCaseIndex = this.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)
    // if switch case has no break statement, it should keep parsing until any break or end of default case
    return this.parseCasesUntilBreakOrDefault(
      switchCases,
      firstNonEmptyCaseIndex
    )
  }

  getFirstNonEmptyCaseIndex(switchCases, matchedIndex) {
    const switchCasesCount = switchCases.length
    let firstNonEmptyCaseIndex

    for (let i = matchedIndex; i < switchCasesCount; i += 1) {
      const notEmptyOrDefault = this.isCaseNotEmptyOrDefault(switchCases[i])

      if (notEmptyOrDefault) {
        firstNonEmptyCaseIndex = i
        break
      }
    }
    return firstNonEmptyCaseIndex
  }

  isCaseNotEmptyOrDefault(switchCase) {
    if (switchCase.test === null ||
        switchCase.consequent.length > 0) {
      return true
    }
    return false
  }

  parseCasesUntilBreakOrDefault(switchCases, firstNonEmptyCaseIndex) {
    // @TODO: should not return BREAK
    // @TODO: parse until break
    // @TODO: should return return value

  }

  SwitchCase(switchCase) {
    // @TODO: should return value
    // @TODO: terminate when break / return
    // @TODO: should return status (break or return)
  }

  /*************************/
  /*      Declarations     */
  /*************************/

  VariableDeclaration(variableDeclaration) {
    variableDeclaration.declarations.forEach((node) => {
      this.parseNode(node)
    })
  }

  VariableDeclarator(variableDeclarator) {
    // @TODO: var, let, const
    this.closureStack.set(
      variableDeclarator.id.name,
      variableDeclarator.init ?
        this.parseNode(variableDeclarator.init) : undefined
    )
  }

  /*************************/
  /*      Expressions      */
  /*************************/

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
      return this.handleReferenceOperation(
        unaryExpression.argument,
        unaryOperation
      )
    }
    return this.handleOperation(
      unaryExpression.argument,
      unaryOperation
    )
  }

  handleReferenceOperation(argument, operation, ...args) {
    switch (argument.type) {
      case 'Identifier':
        return operation({
          property: argument.name
        }, ...args)

      case 'MemberExpression': {
        const expressionReference = this.getMemberExpressionReference(argument)
        return operation(expressionReference, ...args)
      }

      default:
        // @TODO: need to test outlier
        return undefined
    }
  }

  getMemberExpressionReference(memberExpression) {
    const expression = this.parseExpression(memberExpression)
    const expressionReference = expression.getReference()

    return expressionReference
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
    const object = this.getObjectAsExpressionArray(
      memberExpression.object
    )
    const property = this.getPropertyAsString(
      memberExpression.property,
      memberExpression.computed
    )
    return [...object, property]
  }

  getObjectAsExpressionArray(object) {
    switch (object.type) {
      case 'MemberExpression':
      case 'CallExpression':
        return this[`parse${object.type}`](object)

      default:
        return [this.parseNode(object)]
    }
  }

  parseCallExpression(callExpression) {
    const calledArguments = this.parseArguments(callExpression.arguments)
    const {callee, method} = this.parseCalleeAndMethod(callExpression.callee, calledArguments)

    return callee === null ? [method] : [...callee, method]
  }

  parseArguments(calledArguments) {
    return calledArguments.map((argument) => {
      return this.parseNode(argument)
    })
  }

  parseCalleeAndMethod(calleeExpression, calledArguments) {
    const {callee, method} = this.getCalleeAndMethod(calleeExpression)

    return {
      callee,
      method: {
        method,
        arguments: calledArguments
      }
    }
  }

  getCalleeAndMethod(calleeExpression) {
    switch (calleeExpression.type) {
      case 'MemberExpression':
        return {
          callee: this.getObjectAsExpressionArray(calleeExpression.object),
          method: this.getPropertyAsString(
            calleeExpression.property,
            calleeExpression.computed
          )
        }

      default:
        return {
          callee: null,
          method: this.parseNode(calleeExpression)
        }
    }
  }

  UpdateExpression(updateExpression) {
    const transformedExpression = this.transformUpdateToAssignment(updateExpression)
    const newValue = this.AssignmentExpression(transformedExpression)

    return updateExpression.prefix ? newValue : this.parseNode(updateExpression.argument)
  }

  transformUpdateToAssignment(updateExpression) {
    const assignmentExpression = {
      type: 'AssignmentExpression',
      // transform ['++', '--'] to ['+=', '-=']
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

  AssignmentExpression(assignmentExpression) {
    // @TODO: native style manipulation
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
