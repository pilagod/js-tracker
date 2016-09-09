/* import libs */
const escodegen = require('escodegen')

/* import structures */
const Callee = require('./structures/Callee')
const FunctionAgent = require('./structures/FunctionAgent')

/* import operators */
const binaryOperators = require('./operators/binaryOperators')
const unaryOperators = require('./operators/unaryOperators')

/* for variables init */
const Collection = require('./structures/Collection')
const FlowState = require('./structures/FlowState')
const ClosureStack = require('./structures/ClosureStack')
const checkerDispatcher = require('./dispatchers/checkerDispatcher')

class EsprimaParser {
  constructor(context) {
    /* import libs */
    this.escodegen = escodegen

    /* import structures */
    this.Callee = Callee // main use for execute
    this.Collection = Collection
    this.FunctionAgent = FunctionAgent

    /* import operators */
    this.binaryOperators = binaryOperators
    this.unaryOperators = this.initUnaryOperators(unaryOperators)
    this.logicalOperators = this.initLogicalOperators()
    this.assignmentOperators = this.initAssignmentOperators()

    /* variables */
    context.this = context
    this.context = context
    this.scriptUrl = null

    this.collection = new Collection()
    this.flowState = new FlowState()
    this.closureStack = new ClosureStack(context)
    this.checkerDispatcher = checkerDispatcher

    /* init binding */
    // this.executeReducer = this.executeReducer.bind(this)
  }

  initUnaryOperators(importedUnaryOperators = {}) {
    return Object.assign({}, importedUnaryOperators, {
      'delete': ({caller, callee}) => {
        const target = caller ? caller : this.context

        return delete target[callee]
      }
    })
  }

  initLogicalOperators() {
    return {
      '||': (left, right) => {
        return this.parseNode(left) || this.parseNode(right)
      },
      '&&': (left, right) => {
        return this.parseNode(left) && this.parseNode(right)
      }
    }
  }

  initAssignmentOperators() {
    return {
      '=': (target, value) => {
        const status = this.checkerDispatcher.dispatch(
          Object.assign({
            context: this.context
          }, target)
        )
        // console.log('asign status:', status);
        this.handleAssignment(target, value, status)
      }
    }
  }

  handleAssignment(target, value, status) {
    if (status) {
      this.handleAssignManipulation(target, value, status)
    } else {
      this.handleAssignOperation(target, value)
    }
  }

  handleAssignManipulation(target, value, status) {
    // addInfoToCollection is at the bottom of this file
    this.addInfoToCollection(target, status)

    if (status.type === this.Collection.EVENT) {
      this.registerPropEvent(target, value)
    }
  }

  registerPropEvent({caller, callee}, value) {
    const addEventListener =
      this.createAddEventListenerFromPropEvent(callee, value)

    this.execute([caller, addEventListener])
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

  handleAssignOperation({caller, callee}, value) {
    if (caller === undefined) {
      this.updateVariables(callee, value)
    } else {
      caller[callee] = value
    }
  }

  /*************************/
  /*        Parsers        */
  /*************************/

  parseAst(root, scriptUrl) {
    this.setScriptUrl(scriptUrl)
    this.parseNode(root)
  }

  setScriptUrl(scriptUrl) {
    this.scriptUrl = scriptUrl
  }

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
    this.parseStatements(program.body)
  }

  parseStatements(statements) {
    const otherStatements = this.parseFunctionDeclaration(statements)

    return this.parseOtherStatements(otherStatements)
  }

  parseFunctionDeclaration(statements) {
    const otherStatements = []

    for (const statement of statements) {
      if (statement.type === 'FunctionDeclaration') {
        this.parseNode(statement)
      } else {
        otherStatements.push(statement)
      }
    }
    return otherStatements
  }

  parseOtherStatements(statements) {
    let result

    for (const statement of statements) {
      result = this.parseNode(statement)

      if (this.flowState.isEitherState()) {
        break
      }
    }
    return result
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

    arrayExpression.elements.forEach((node, index) => {
      result.push(this.parseNode(node))
      // delete null node (e.g. [1, , 2] != [1, undefined, 2])
      if (!node) {
        delete result[index]
      }
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
      key: this.getPropertyKey(
        property.key,
        property.computed
      ),
      value: this.parseNode(property.value)
    }
  }

  getPropertyKey(key, computed) {
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
        {},
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
      params: this.parseFunctionParamsName(functionExpression.params)
    }
  }

  parseFunctionParamsName(params) {
    // @TODO: a way to identify rest args
    return params.map((param) => {
      return this.getNameFromPattern(param)
    })
  }

  wrapFunctionAgentWithFunction(functionAgent) {
    const self = this

    return function (...calledArguments) {
      return self.parseFunctionAgent(functionAgent, {
        this: this,
        arguments: arguments
      }, calledArguments)
    }
  }

  parseFunctionAgent(functionAgent, builtInArguments, calledArguments) {
    // environment refers to an object containing scriptUrl and closureStack
    const globalEnvironment = this.getEnvironment(this)
    const functionEnvironment = this.getEnvironment(functionAgent)

    this.setEnvironment(this, functionEnvironment)
    this.setFunctionClosure(builtInArguments, {
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

  setFunctionClosure(builtInArguments, calledArguments) {
    this.closureStack.createClosure()

    this.setBuiltInArguments(builtInArguments)
    this.setCalledArguments(calledArguments)
  }

  setBuiltInArguments(builtInArguments) {
    this.setVariables('this', builtInArguments.this || this.context)
    this.setVariables('arguments', builtInArguments.arguments)
  }

  setCalledArguments({keys, values}) {
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
    const property = this.getPropertyKey(
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
    const method = this.getPropertyKey(
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
      loc: expression.loc,
      code: this.escodegen.generate(expression),
      scriptUrl: this.scriptUrl
    }
  }

  getReference(data) {
    return {
      caller: this.checkAndExecute(data.slice(0, data.length - 1)),
      callee: data.slice(-1)[0]
    }
  }

  handlePatternReferenceOperation(pattern, operation, ...args) {
    const callee = this.getNameFromPattern(pattern)

    return operation({callee}, ...args)
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
    const logicalOperation = this.logicalOperators[logicalExpression.operator]

    return logicalOperation(logicalExpression.left, logicalExpression.right)
  }

  MemberExpression(memberExpression) {
    const caller = this.parseNode(memberExpression.object)
    const callee = this.getPropertyKey(
      memberExpression.property,
      memberExpression.computed
    )
    return this.execute({caller, callee})
  }

  execute(exp) {
    try {
      return this.executeExp(exp)
    } catch (e) {
      return undefined
    }
  }

  executeExp(exp) {
    return (exp.callee instanceof this.Callee) ?
      this.executeCall(exp) : this.executeMember(exp)
  }

  executeCall({caller, callee}) {
    // a function had been bound can not change context by bind, call and apply
    // a function call or apply with non-object context would be ignored
    const calledMethod = this.getCalledMethod({caller, callee})

    return calledMethod.apply(caller, callee.arguments)
  }

  getCalledMethod({caller, callee}) {
    return caller ? caller[callee.method] : callee.method
  }

  executeMember({caller, callee}) {
    return caller[callee]
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
    const target = {caller, callee, info}
    // status: {type, execute, passive}
    const status = this.checkerDispatcher.dispatch(
      Object.assign({
        context: this.context
      }, target)
    )
    // console.log('call status:', status);
    if (status) {
      this.addInfoToCollection(target, status)
    }
    return this.getNextCaller(target, status)
  }

  addInfoToCollection(target, status) {
    const object = this.getTargetObject(target, status)
    const elements = this.getTargetElements(object)

    this.addInfoByStatus({
      elements,
      info: target.info
    }, status)
  }

  getTargetObject({caller}, status) {
    if (status.hasOwnProperty('passive')) {
      return status.passive
    } else if (this.isStyleOrDOMTokenList(caller)) {
      return caller.parent
    } else if (this.isAttr(caller)) {
      return caller.ownerElement
    }
    return caller
  }

  isAttr(object) {
    return (object instanceof this.context.Attr)
  }

  getTargetElements(object) {
    return this.isJquery(object) ? object.get() : [object]
  }

  isJquery(object) {
    const jQuery = this.context.jQuery

    return !!jQuery && object instanceof jQuery
  }

  addInfoByStatus(info, status) {
    switch (status.type) {
      case this.Collection.EVENT:
        this.collection.addEvent(info)
        break

      case this.Collection.MANIPULATION:
        this.collection.addManipulation(info)
        break

      default:
    }
  }

  getNextCaller({caller, callee}, status) {
    if (status && status.hasOwnProperty('execute')) {
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
