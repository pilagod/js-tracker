/* import libs */
const escodegen = require('escodegen')

/* import structures */
const Method = require('./structures/Method')
const FunctionAgent = require('./structures/FunctionAgent')

/* import operators */
const unaryOperators = require('./operators/unaryOperators')
const binaryOperators = require('./operators/binaryOperators')
const logicalOperators = require('./operators/logicalOperators')

/* for variables init */
const FlowStatus = require('./structures/FlowStatus')
const ClosureStack = require('./structures/ClosureStack')

class EsprimaParser {
  constructor() {
    // @TODO: context (send window)
    /* import libs */
    this.escodegen = escodegen.generate

    /* import structures */
    this.Method = Method // main use for execute
    this.FunctionAgent = FunctionAgent

    /* import operators */
    this.binaryOperators = binaryOperators
    this.logicalOperators = logicalOperators
    this.unaryOperators = this.initUnaryOperators(unaryOperators)
    this.assignmentOperators = this.initAssignmentOperators()

    /* variables */
    this.scriptUrl = ''
    this.flowStatus = new FlowStatus()
    this.closureStack = new ClosureStack()
  }

  initUnaryOperators(importedUnaryOperators = {}) {
    return Object.assign({}, importedUnaryOperators, {
      'delete': ({object, property}) => {
        let targetObject = object
        // default parameter can't be stubbed
        if (targetObject === undefined) {
          targetObject = this.closureStack.get('window')
        }
        return delete targetObject[property]
      }
    })
  }

  initAssignmentOperators(importedAssignmentOperators = {}) {
    return Object.assign({}, importedAssignmentOperators, {
      '=': ({object, property, info}, value) => {
        // @TODO: get one more argument: info
        // @TODO: check object style / classList / dom manipulation
        if (object === undefined) {
          this.updateVariables(property, value)
        } else {
          object[property] = value
        }
      }
    })
  }

  /*************************/
  /*        Parsers        */
  /*************************/

  parseNode(node) {
    if (node) {
      return this[node.type](node)
    }
    return undefined
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
    // @TODO: es6: create and push new block scope to closureStack
    const result = this.parseStatements(blockStatement.body)
    // @TODO: es6: pop block scope from closureStack
    return result
  }

  parseStatements(statements) {
    let result

    for (const statement of statements) {
      result = this.parseNode(statement)

      if (this.flowStatus.isEitherStatus()) {
        break
      }
    }
    return result
  }

  EmptyStatement() {
  }

  ReturnStatement(returnStatement) {
    this.flowStatus.set('return')

    return returnStatement.argument ?
      this.parseNode(returnStatement.argument) : undefined
  }

  BreakStatement() {
    this.flowStatus.set('break')
  }

  ContinueStatement() {
    this.flowStatus.set('continue')
  }

  IfStatement(ifStatement) {
    const testPass = this.parseNode(ifStatement.test)

    if (testPass) {
      return this.parseNode(ifStatement.consequent)
    }
    return this.parseNode(ifStatement.alternate)
  }

  SwitchStatement(switchStatement) {
    const discriminant = this.parseNode(switchStatement.discriminant)
    const result = this.parseSwitchCases(switchStatement.cases, discriminant)

    this.flowStatus.unset('break')

    return result
  }

  parseSwitchCases(switchCases, discriminant) {
    let result

    for (const [matchedIndex, switchCase] of switchCases.entries()) {
      const matched = this.isCaseMatched(switchCase.test, discriminant)

      if (matched) {
        result = this.parseMatchedCase(switchCases, matchedIndex)
        break
      }
    }
    return result
  }

  isCaseMatched(testExpression, discriminant) {
    if (testExpression === null) {
      // default case
      return true
    }
    return (
      this.parseNode(testExpression) === discriminant
    )
  }

  parseMatchedCase(switchCases, matchedIndex) {
    // matched case might be empty and combined together with consequent cases,
    // start parsing statements from matchedIndex,
    // if the case has no break / return statement (including empty case),
    // it should keep parsing consequent cases until any break / return or end of default case
    return this.parseStatements(switchCases.slice(matchedIndex))
  }

  SwitchCase(switchCase) {
    return this.parseStatements(switchCase.consequent)
  }

  /*************************/
  /*       Exceptions      */
  /*************************/

  ThrowStatement(throwStatement) {
    const error = this.parseNode(throwStatement.argument)
    throw error
  }

  TryStatement(tryStatement) {
    let result

    try {
      result = this.parseNode(tryStatement.block) || result
    } catch (e) {
      result = this.handleCatchClause(tryStatement.handler, e) || result
    } finally {
      result = this.handleFinalizer(tryStatement.finalizer) || result
    }
    return result
  }

  handleCatchClause(handler, error) {
    if (!handler) {
      throw error
    }
    this.setErrorInCatchClause(handler.param, error)

    return this.parseNode(handler.body)
  }

  setErrorInCatchClause(param, error) {
    // @TODO: es6: create new block closure
    const variables = this.getNameFromPattern(param)

    this.setVariables(variables, error)
  }

  getNameFromPattern(pattern) {
    // @TODO: es6: ObjectPattern / ArrayPattern
    switch (pattern.type) {
      case 'Identifier':
        return pattern.name

      default:
        return null
    }
  }

  setVariables(variables, values) {
    // @TODO: es6: function closure / block closure
    // @TODO: es6: ObjectPattern / ArrayPattern
    this.closureStack.set(variables, values)
  }

  handleFinalizer(finalizer) {
    return finalizer ?
      this.parseNode(finalizer) : undefined
  }

  /*************************/
  /*         Loops         */
  /*************************/

  WhileStatement(whileStatement) {
    let result, status

    while (this.parseNode(whileStatement.test)) {
      result = this.parseNode(whileStatement.body)
      status = this.getLoopStatusAndReset()

      if (status === 'break') {
        break
      }
    }
    return result
  }

  getLoopStatusAndReset() {
    let status

    if (this.flowStatus.isLoopBreakStatus()) {
      status = 'break'
    } else if (this.flowStatus.isLoopContinueStatus()) {
      status = 'continue'
    }

    if (status) {
      this.flowStatus.unset(status)
    }
    return status
  }

  DoWhileStatement(doWhileStatement) {
    let result = this.parseNode(doWhileStatement.body)

    const status = this.getLoopStatusAndReset()

    if (status !== 'break') {
      result = this.WhileStatement(doWhileStatement)
    }
    return result
  }

  ForStatement(forStatement) {
    // @TODO: es6: block closure
    let result, status

    for (
      this.parseNode(forStatement.init);
      this.parseNode(forStatement.test);
      this.parseNode(forStatement.update)
    ) {
      result = this.parseNode(forStatement.body)
      status = this.getLoopStatusAndReset()

      if (status === 'break') {
        break
      }
    }
    return result
  }

  ForInStatement(forInStatement) {
    // @TODO: es6: block closure
    const left = this.getIteratorName(forInStatement.left)
    const right = this.parseNode(forInStatement.right)
    let result, status

    for (const key in right) {
      this.updateVariables(left, key)

      result = this.parseNode(forInStatement.body)
      status = this.getLoopStatusAndReset()

      if (status === 'break') {
        break
      }
    }
    return result
  }

  getIteratorName(node) {
    switch (node.type) {
      case 'VariableDeclaration':
        return this.getNameFromVariableDeclaration(node)

      default:
        return this.getNameFromPattern(node)
    }
  }

  getNameFromVariableDeclaration(variableDeclaration) {
    this.parseNode(variableDeclaration)

    return this.getNameFromPattern(
      variableDeclaration.declarations[0].id
    )
  }

  updateVariables(variables, values) {
    // @TODO: es6: ObjectPattern / ArrayPattern
    this.closureStack.update(variables, values)
  }

  /*************************/
  /*      Declarations     */
  /*************************/

  FunctionDeclaration(functionDeclaration) {
    // id is Identifier only
    const variable = this.getNameFromPattern(functionDeclaration.id)
    const value = this.FunctionExpression(functionDeclaration)

    this.setVariables(variable, value)
  }

  VariableDeclaration(variableDeclaration) {
    variableDeclaration.declarations.forEach((node) => {
      this.parseNode(node)
    })
  }

  VariableDeclarator(variableDeclarator) {
    // @TODO: var -> function closure
    // @TODO: es6: let, const -> block closure
    const variables = this.getNameFromPattern(variableDeclarator.id)
    const values = variableDeclarator.init ?
      this.parseNode(variableDeclarator.init) : undefined

    this.setVariables(variables, values)
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
      key: this.getPropertyKeyAsString(property.key, property.computed),
      value: this.parseNode(property.value)
    }
  }

  getPropertyKeyAsString(key, computed) {
    return `${this.getPropertyKeyValue(key, computed)}`
  }

  getPropertyKeyValue(key, computed) {
    if (computed) {
      return this.parseNode(key)
    }
    return key.name || key.value
  }

  FunctionExpression(functionExpression) {
    const functionAgent = this.createFunctionAgent(functionExpression)
    // @TODO: set prototype __proto__ to given extends object
    functionAgent.prototype.constructor = functionAgent

    return functionAgent
  }

  createFunctionAgent() {
    // @TODO: parseFunctionInfo
    // @TODO: parse params (in order not to parse every time function called)
    // self default should be undefined
    // return new (this.FunctionAgent)({
    //   body: functionExpression.body,
    //   params: functionExpression.params,
    //   // should bind EsprimaParser here to get access to
    //   // its properties / methods in FunctionAgent class
    //   parser: this.parseFunctionAgent.bind(this),
    //   scriptUrl: this.scriptUrl,
    //   closureStack: this.closureStack.getStack()
    // })
  }

  parseFunctionAgent(functionAgent, context, calledArguments) {
    // environment refers to scriptUrl and closureStack
    const globalEnvironment = this.getEnvironment(this)
    const functionEnvironment = this.getEnvironment(functionAgent)

    this.setEnvironment(this, functionEnvironment)
    this.setFunctionClosure(context, {
      keys: functionAgent.params,
      values: calledArguments
    })
    const result = this.parseNode(functionAgent.body)

    this.setEnvironment(this, globalEnvironment)

    return result
  }

  getEnvironment(context) {
    return {
      scriptUrl: context.scriptUrl,
      closureStack: context.closureStack.getStack()
    }
  }

  setEnvironment(context, environment) {
    context.scriptUrl = environment.scriptUrl
    context.closureStack = environment.closureStack
  }

  setFunctionClosure(context, params) {
    this.closureStack.createClosure()

    this.setFunctionContext(context)
    this.setFunctionArguments(params)
  }

  setFunctionContext(context) {
    this.setVariables('this', context)
  }

  setFunctionArguments({keys, values}) {
    const length = keys.length

    for (let i = 0; i < length; i += 1) {
      this.setVariables(keys[i], values[i])
    }
  }

  UnaryExpression(unaryExpression) {
    const unaryOperation = this.unaryOperators[unaryExpression.operator]

    if (unaryExpression.operator === 'delete') {
      return this.handleReferenceOperation(
        unaryExpression.argument,
        unaryOperation
      )
    }
    return this.handleUnaryOperation(
      unaryExpression.argument,
      unaryOperation
    )
  }

  handleReferenceOperation(argument, operation, ...args) {
    switch (argument.type) {
      case 'MemberExpression':
        return this.handleMemberReferenceOperation(
          argument, operation, ...args
        )
      default:
        return this.handlePatternReferenceOperation(
          argument, operation, ...args
        )
    }
  }

  handleMemberReferenceOperation(memberExpression, operation, ...args) {
    const expression = this.parseExpression(memberExpression)
    const reference = this.getReference(expression.data)

    return operation(
      Object.assign(reference, {
        info: expression.info
      }), ...args
    )
  }

  parseExpression(expression) {
    return {
      data: this.transformExpressionToData(expression),
      info: this.parseExpressionInfo(expression)
    }
  }

  transformExpressionToData(expression) {
    return this[`parse${expression.type}`](expression)
  }

  parseMemberExpression(memberExpression) {
    const object = this.getObjectAsExpressionArray(
      memberExpression.object
    )
    const property = this.getPropertyKeyAsString(
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
    const {callee, method} = this.parseCallee(callExpression.callee)
    const parsedArguments = this.parseArguments(callExpression.arguments)

    method.setArguments(parsedArguments)

    return callee ? [...callee, method] : [method]
  }

  parseCallee(calleeExpression) {
    switch (calleeExpression.type) {
      case 'MemberExpression':
        return this.parseMemberCallee(calleeExpression)

      default:
        return this.parseOtherCallee(calleeExpression)
    }
  }

  parseMemberCallee(calleeExpression) {
    const callee = this.getObjectAsExpressionArray(calleeExpression.object)
    const method = this.getPropertyKeyAsString(
      calleeExpression.property,
      calleeExpression.computed
    )
    return {
      callee,
      method: this.getMethodInstance(method)
    }
  }

  getMethodInstance(method) {
    return new (this.Method)(method)
  }

  parseOtherCallee(calleeExpression) {
    const method = this.parseNode(calleeExpression)

    return {
      callee: undefined,
      method: this.getMethodInstance(method)
    }
  }

  parseArguments(calledArguments) {
    return calledArguments.map((argument) => {
      return this.parseNode(argument)
    })
  }

  parseExpressionInfo(expression) {
    return {
      code: this.escodegen(expression),
      loc: expression.loc
    }
  }

  getReference(data) {
    return {
      object: this.execute(data.slice(0, data.length - 1)),
      property: data.slice(-1)[0]
    }
  }

  handlePatternReferenceOperation(pattern, operation, ...args) {
    const property = this.getNameFromPattern(pattern)

    return operation({property}, ...args)
  }

  handleUnaryOperation(argument, operation) {
    return operation(this.parseNode(argument))
  }

  UpdateExpression(updateExpression) {
    const transformedExpression = this.transformUpdateToAssignment(updateExpression)
    const newValue = this.AssignmentExpression(transformedExpression)

    return updateExpression.prefix ?
      newValue : this.parseNode(updateExpression.argument)
  }

  transformUpdateToAssignment(updateExpression) {
    return {
      type: 'AssignmentExpression',
      operator: `${updateExpression.operator[0]}=`, // transform ['++', '--'] to ['+=', '-=']
      left: updateExpression.argument,
      right: {type: 'Literal', value: 1, raw: '1'}
    }
  }

  BinaryExpression(binaryExpression) {
    const left = this.parseNode(binaryExpression.left)
    const right = this.parseNode(binaryExpression.right)
    const binaryOperation = this.binaryOperators[binaryExpression.operator]

    return binaryOperation(left, right)
  }

  AssignmentExpression(assignmentExpression) {
    const binaryExpression = this.transformAssignmentToBinary(assignmentExpression)
    const assignedValue = this.BinaryExpression(binaryExpression)

    this.handleReferenceOperation(
      assignmentExpression.left,
      this.assignmentOperators['='],
      assignedValue
    )
    return assignedValue
  }

  transformAssignmentToBinary(assignmentExpression) {
    return {
      type: 'BinaryExpression',
      operator: assignmentExpression.operator.replace(/\=$/, ''),
      left: assignmentExpression.left,
      right: assignmentExpression.right
    }
  }

  LogicalExpression(logicalExpression) {
    const left = this.parseNode(logicalExpression.left)
    const right = this.parseNode(logicalExpression.right)
    const logicalOperation = this.logicalOperators[logicalExpression.operator]

    return logicalOperation(left, right)
  }

  MemberExpression(memberExpression) {
    const expression = this.parseExpression(memberExpression)

    return this.execute(expression.data)
  }

  execute(data) {
    try {
      return this.executeExpression(data)
    } catch (e) {
      return undefined
    }
  }

  executeExpression(data) {
    const executedData = data.reduce(this.executeReducer, undefined)

    this.setStyleOrDOMTokenListParent(data, executedData)

    return executedData
  }

  executeReducer(pre, cur) {
    if (cur instanceof this.Method) {
      return this.executeCall(pre, cur)
    }
    return this.executeMember(pre, cur)
  }

  executeCall(pre, cur) {
    const method = this.getMethod(pre, cur)
    const context = method.self || pre

    return method.apply(context, cur.arguments)
  }

  getMethod(pre, cur) {
    // @TODO: should check prototype
    // @TODO: custom constructor type
    if (pre === undefined) {
      return cur.method
    }
    return pre[cur.method]
  }

  executeMember(pre, cur) {
    return (pre === undefined) ? cur : pre[cur]
  }

  setStyleOrDOMTokenListParent(data, executedData) {
    // definition of valid here are
    // (1) executedData has no parent property, and
    // (2) executedData is Style or DOMTokenList
    if (this.isValidStyleOrDOMTokenList(executedData)) {
      executedData.parent = this.getReference(data).object
    }
  }

  isValidStyleOrDOMTokenList(executedData) {
    return (
      this.hasNoParent(executedData) &&
      this.isStyleOrDOMTokenList(executedData)
    )
  }

  hasNoParent(executedData) {
    return (
      executedData instanceof Object &&
      executedData.hasOwnProperty('parent')
    )
  }

  isStyleOrDOMTokenList(executedData) {
    const context = this.closureStack.get('window')

    return (
      this.isStyle(context, executedData) ||
      this.isDOMTokenList(context, executedData)
    )
  }

  isStyle(context, executedData) {
    return (executedData instanceof context.CSSStyleDeclaration)
  }

  isDOMTokenList(context, executedData) {
    return (executedData instanceof context.DOMTokenList)
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

  NewExpression(newExpression) {
    const CalledConstructor = this.parseNode(newExpression.callee)
    const initArguments = this.parseArguments(newExpression.arguments)

    return this.createInstance(CalledConstructor, initArguments)
  }

  createInstance(CalledConstructor, initArguments) {
    if (CalledConstructor instanceof this.FunctionAgent) {
      return this.createInstanceFromFunctionAgent(
        CalledConstructor,
        initArguments
      )
    }
    return this.createInstanceFromBasicType(
      CalledConstructor,
      initArguments
    )
  }

  createInstanceFromFunctionAgent(CalledConstructor, initArguments) {
    // skeleton here is an uninitilized instance with its prototype chain has been set
    const instance = this.createInstanceSkeleton(CalledConstructor)

    instance.constructor = CalledConstructor
    // do initialization while creating new class object
    this.parseFunctionAgent(CalledConstructor, instance, initArguments)

    return instance
  }

  createInstanceSkeleton(CalledConstructor) {
    const NewConstructor = this.createNewConstructor()

    NewConstructor.prototype = Object.create(CalledConstructor.prototype)

    return new NewConstructor()
  }

  createNewConstructor() {
    return function () {}
  }

  createInstanceFromBasicType(CustomConstructor, initArguments) {
    return new CustomConstructor(...initArguments)
  }

  SequenceExpression(sequenceExpression) {
    let result

    sequenceExpression.expressions.forEach((expression) => {
      // all here are expressions, no need to check flow control status
      result = this.parseNode(expression)
    })
    return result
  }
}

module.exports = EsprimaParser
