/* import libs */
const escodegen = require('escodegen')

/* import structures */
const Callee = require('./structures/Callee')
const FunctionAgent = require('./structures/FunctionAgent')

/* import operators */
const binaryOperators = require('./operators/binaryOperators')
const logicalOperators = require('./operators/logicalOperators')
const unaryOperators = require('./operators/unaryOperators')

/* for variables init */
const Collection = require('./structures/Collection')
const FlowState = require('./structures/FlowState')
const ClosureStack = require('./structures/ClosureStack')
const checkerDispatcher = require('./dispatchers/checkerDispatcher')

class EsprimaParser {
  constructor() {
    // @TODO: context (send window)

    /* import libs */
    this.escodegen = escodegen.generate

    /* import structures */
    this.Callee = Callee // main use for execute
    this.FunctionAgent = FunctionAgent

    /* import operators */
    this.binaryOperators = binaryOperators
    this.logicalOperators = logicalOperators
    this.unaryOperators = this.initUnaryOperators(unaryOperators)
    this.assignmentOperators = this.initAssignmentOperators()

    /* variables */
    this.context = {}
    this.scriptUrl = ''

    this.collection = new Collection()
    this.flowState = new FlowState()
    this.closureStack = new ClosureStack() // init with context
    this.checkerDispatcher = checkerDispatcher
  }

  initUnaryOperators(importedUnaryOperators = {}) {
    return Object.assign({}, importedUnaryOperators, {
      'delete': ({object, property}) => {
        const target = object ? object : this.context

        return delete target[property]
      }
    })
  }

  initAssignmentOperators(importedAssignmentOperators = {}) {
    return Object.assign({}, importedAssignmentOperators, {
      '=': ({object, property, info}, value) => {
        const status = this.checkerDispatcher.dispatch({
          caller: object,
          callee: property,
          context: this.context
        })
        if (status) {
          this.handleAssignManipulation(object, property, info, value, status)
        } else {
          this.handleAssignOperation(object, property, value)
        }
      }
    })
  }

  handleAssignManipulation(object, property, info, value, status) {
    // addInfoToCollection is at the bottom of this file
    this.addInfoToCollection(object, property, info, status)

    if (status.type === Collection.EVENT) {
      this.registerPropEvent(object, property, value)
    }
  }

  registerPropEvent(object, property, value) {
    const addEventListener =
      this.createAddEventListenerFromPropEvent(property, value)

    this.execute([object, addEventListener])
  }

  createAddEventListenerFromPropEvent(propEvent, handler) {
    const addEventListener = new (this.Callee)('addEventListener')
    const event = this.getEventFromPropEvent(propEvent)

    addEventListener.addArguments([event, handler])

    return addEventListener
  }

  getEventFromPropEvent(propEvent) {
    return propEvent.replace(/^on/, '')
  }

  handleAssignOperation(object, property, value) {
    if (object === undefined) {
      this.updateVariables(property, value)
    } else {
      object[property] = value
    }
  }

  /*************************/
  /*        Parsers        */
  /*************************/

  parseNode(node) {
    return node ? this[node.type](node) : undefined
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

      if (this.flowState.isEitherState()) {
        break
      }
    }
    return result
  }

  EmptyStatement() {
  }

  ReturnStatement(returnStatement) {
    // should call parseReturnArgument before set 'return' status,
    // because return argument might be another function which has return value,
    // after that function finishing, it will unset all return status, including status set here
    const result = this.parseReturnArgument(returnStatement.argument)

    this.flowState.set(FlowState.RETURN)

    return result
  }

  parseReturnArgument(argument) {
    return argument ? this.parseNode(argument) : undefined
  }

  BreakStatement() {
    this.flowState.set(FlowState.BREAK)
  }

  ContinueStatement() {
    this.flowState.set(FlowState.CONTINUE)
  }

  IfStatement(ifStatement) {
    const testPass = this.parseNode(ifStatement.test)

    return testPass ?
      this.parseNode(ifStatement.consequent) :
      this.parseNode(ifStatement.alternate)
  }

  SwitchStatement(switchStatement) {
    const discriminant = this.parseNode(switchStatement.discriminant)
    const result = this.parseSwitchCases(switchStatement.cases, discriminant)

    this.flowState.unset(FlowState.BREAK)

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
    return (this.parseNode(testExpression) === discriminant)
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
    return finalizer ? this.parseNode(finalizer) : undefined
  }

  /*************************/
  /*         Loops         */
  /*************************/

  WhileStatement(whileStatement) {
    let result, state

    while (this.parseNode(whileStatement.test)) {
      ({result, state} =
          this.parseLoopBody(whileStatement.body))

      if (state === FlowState.BREAK) {
        break
      }
    }
    return result
  }

  parseLoopBody(body) {
    const result = this.parseNode(body)
    const state = this.resetLoopState()

    return {result, state}
  }

  resetLoopState() {
    const state = this.getLoopState()

    this.flowState.unset(state)

    return state
  }

  getLoopState() {
    if (this.flowState.isLoopBreakState()) {
      return FlowState.BREAK
    } else if (this.flowState.isLoopContinueState()) {
      return FlowState.CONTINUE
    }
    return undefined
  }

  DoWhileStatement(doWhileStatement) {
    let {result, state} =
      this.parseLoopBody(doWhileStatement.body)

    if (state !== FlowState.BREAK) {
      result = this.WhileStatement(doWhileStatement)
    }
    return result
  }

  ForStatement(forStatement) {
    // @TODO: es6: block closure
    let result, state

    for (
      this.parseNode(forStatement.init);
      this.parseNode(forStatement.test);
      this.parseNode(forStatement.update)
    ) {
      ({result, state} =
        this.parseLoopBody(forStatement.body))

      if (state === FlowState.BREAK) {
        break
      }
    }
    return result
  }

  ForInStatement(forInStatement) {
    // @TODO: es6: block closure
    const left = this.getIteratorName(forInStatement.left)
    const right = this.parseNode(forInStatement.right)

    let result, state

    for (const key in right) {
      this.updateVariables(left, key);

      ({result, state} =
        this.parseLoopBody(forInStatement.body))

      if (state === FlowState.BREAK) {
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
      key: this.getPropertyKeyAsString(
        property.key,
        property.computed
      ),
      value: this.parseNode(property.value)
    }
  }

  getPropertyKeyAsString(key, computed) {
    const propertyKey = this.getPropertyKeyValue(key, computed)

    return `${propertyKey}`
  }

  getPropertyKeyValue(key, computed) {
    if (computed) {
      return this.parseNode(key)
    }
    return (key.name || key.value)
  }

  FunctionExpression(functionExpression) {
    const functionAgent = this.createFunctionAgent(functionExpression)

    return this.wrapFunctionAgentWithFunction(functionAgent)
  }

  createFunctionAgent(functionExpression) {
    const functionEnvironment = this.getEnvironment(this)
    const functionInfo = this.parseFunctionInfo(functionExpression)

    return new (this.FunctionAgent)(
      Object.assign(
        functionEnvironment,
        functionInfo
      )
    )
  }

  getEnvironment(context) {
    return {
      scriptUrl: context.scriptUrl,
      closureStack: context.closureStack.getClone()
    }
  }

  parseFunctionInfo(functionExpression) {
    return {
      body: functionExpression.body,
      params: this.parseParams(functionExpression.params)
    }
  }

  parseParams(params) {
    return params.map((param) => {
      return this.getNameFromPattern(param)
    })
  }

  wrapFunctionAgentWithFunction(functionAgent) {
    const self = this

    return function (...calledArguments) {
      return self.parseFunctionAgent(functionAgent, this, calledArguments)
    }
  }

  parseFunctionAgent(functionAgent, context, calledArguments) {
    // environment refers to an object containing scriptUrl and closureStack
    const globalEnvironment = this.getEnvironment(this)
    const functionEnvironment = this.getEnvironment(functionAgent)

    this.setEnvironment(this, functionEnvironment)
    this.setFunctionClosure(context, {
      keys: functionAgent.params,
      values: calledArguments
    })
    const result = this.parseNode(functionAgent.body)

    this.setEnvironment(this, globalEnvironment)
    this.flowState.unset(FlowState.RETURN)

    return result
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
    const {caller, callee} = this.parseCallee(callExpression.callee)
    const parsedArguments = this.parseArguments(callExpression.arguments)

    callee.addArguments(parsedArguments)

    return caller ? [...caller, callee] : [callee]
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
    const caller = this.getObjectAsExpressionArray(calleeExpression.object)
    const method = this.getPropertyKeyAsString(
      calleeExpression.property,
      calleeExpression.computed
    )
    return {
      caller,
      callee: this.getCallee(method)
    }
  }

  getCallee(method) {
    return new (this.Callee)(method)
  }

  parseOtherCallee(calleeExpression) {
    const method = this.parseNode(calleeExpression)

    return {
      caller: undefined,
      callee: this.getCallee(method)
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
      loc: expression.loc,
      scriptUrl: this.scriptUrl
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
    const originValue = this.parseNode(updateExpression.argument)
    const updateValue = this.getUpdateValue(updateExpression)

    return updateExpression.prefix ? updateValue : originValue
  }

  getUpdateValue(updateExpression) {
    const assignmentExpression = this.transformUpdateToAssignment(updateExpression)

    return this.AssignmentExpression(assignmentExpression)
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
    const assignmentValue = this.getAssignmentValue(assignmentExpression)

    this.handleReferenceOperation(
      assignmentExpression.left,
      this.assignmentOperators['='],
      assignmentValue
    )
    return assignmentValue
  }

  getAssignmentValue(assignmentExpression) {
    const binaryExpression =
      this.transformAssignmentToBinary(assignmentExpression)

    return binaryExpression.operator ?
      this.BinaryExpression(binaryExpression) :
      this.parseNode(binaryExpression.right)
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
    const result = data.reduce(this.executeReducer, undefined)
    // definition of valid here are
    // (1) result has no parent property, and
    // (2) result is Style or DOMTokenList
    if (this.isValidStyleOrDOMTokenList(result)) {
      result.parent = this.getReference(data).object
    }
    return result
  }

  executeReducer(pre, cur) {
    return (cur instanceof this.Callee) ?
      this.executeCall(pre, cur) :
      this.executeMember(pre, cur)
  }

  executeCall(pre, cur) {
    // a function had been bound can not change context by bind, call and apply
    // a function call or apply with non-object context would be ignored
    const method = this.getMethod(pre, cur)

    return method.apply(pre, cur.arguments)
  }

  getMethod(pre, cur) {
    return (pre === undefined) ? cur.method : pre[cur.method]
  }

  executeMember(pre, cur) {
    return (pre === undefined) ? cur : pre[cur]
  }

  isValidStyleOrDOMTokenList(object) {
    return (
      this.hasNoParent(object) &&
      this.isStyleOrDOMTokenList(object)
    )
  }

  hasNoParent(object) {
    return (object instanceof Object) && (!object.hasOwnProperty('parent'))
  }

  isStyleOrDOMTokenList(object) {
    return this.isStyle(object) || this.isDOMTokenList(object)
  }

  isStyle(object) {
    return (object instanceof this.context.CSSStyleDeclaration)
  }

  isDOMTokenList(object) {
    return (object instanceof this.context.DOMTokenList)
  }

  ConditionalExpression(conditionalExpression) {
    const test = this.parseNode(conditionalExpression.test)

    return test ?
      this.parseNode(conditionalExpression.consequent) :
      this.parseNode(conditionalExpression.alternate)
  }

  CallExpression(callExpression) {
    const expression = this.parseExpression(callExpression)

    return this.checkAndExecute(expression.data, expression.info)
  }

  checkAndExecute(data, info) {
    const caller = this.execute(data.splice(0, 1))
    const checkAndExecuteReducer = this.createCheckAndExecuteReducer(info)
    // reduce on data[1] to data[length - 1]
    return data.reduce(checkAndExecuteReducer, caller)
  }

  createCheckAndExecuteReducer(info) {
    return (...args) => this.checkAndExecuteReducer(info, ...args)
  }

  checkAndExecuteReducer(info, caller, callee) {
    // status: {type, execute, passive}
    const status = this.checkerDispatcher.dispatch({
      caller,
      callee,
      context: this.context
    })
    if (status) {
      this.addInfoToCollection(caller, callee, info, status)
    }
    return this.getNextCaller(caller, callee, status)
  }

  addInfoToCollection(caller, callee, info, status) {
    const affectedElements =
      this.getAffectedElements(caller, callee, status)

    this.addInfoToElements(affectedElements, info, status)
  }

  getAffectedElements(caller, callee, status) {
    const affectedObject =
      this.getAfftectedObject(caller, callee, status)
    const affectedElements =
      this.getElementsFromAffectedObject(affectedObject)

    return affectedElements
  }

  getAfftectedObject(caller, callee, status) {
    if (status.hasOwnProperty('passive')) {
      return callee.arguments[status.passive]
    } else if (this.isStyleOrDOMTokenList(caller)) {
      return caller.parent
    }
    return caller
  }

  getElementsFromAffectedObject(object) {
    return this.isJquery(object) ? object.get() : [object]
  }

  isJquery(object) {
    const jQuery = this.context.jQuery

    return !!jQuery && object instanceof jQuery
  }

  addInfoToElements(elements, info, status) {
    switch (status.type) {
      case Collection.EVENT:
        this.collection.addEvent(elements, info)
        break

      case Collection.MANIPULATION:
        this.collection.addManipulation(elements, info)
        break

      default:
    }
  }

  getNextCaller(caller, callee, status) {
    if (status.hasOwnProperty('execute')) {
      return status.execute
    }
    return this.execute([caller, callee])
  }

  NewExpression(newExpression) {
    const CalledConstructor = this.parseNode(newExpression.callee)
    const calledArguments = this.parseArguments(newExpression.arguments)

    return new CalledConstructor(...calledArguments)
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
