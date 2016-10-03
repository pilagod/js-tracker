// spec: https://github.com/estree/estree/blob/master/spec.md#forstatement

describe('ForStatement tests', () => {
  const label = 'label'
  const options = {label}
  const tests = [true, true, true]

  const setTestResults = (results) => {
    const getTestResults = createResultsGenerator(results)

    for (const index of results.keys()) {
      esprimaParser.parseNode
        .withArgs(forStatement.test)
          .onCall(index).returns(getTestResults())
    }
  }
  let forStatement

  beforeEach(() => {
    forStatement = createAstNode('ForStatement', {
      init: createAstNode('ExpressionInit'),
      test: createAstNode('ExpressionTest'),
      update: createAstNode('ExpressionUpdate'),
      body: createAstNode('Statement')
    })
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'isLoopNeededToBreak')
    setTestResults(tests)
  })

  it('should call parseNode with init only once', () => {
    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.init).calledOnce
    ).to.be.true
  })

  it('should call parseNode with test each loop', () => {
    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.test).callCount
    ).to.be.equal(4)
  })

  it('should call parseNode with update each loop', () => {
    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.update).calledThrice
    ).to.be.true
  })

  it('should call parseNode with body each loop', () => {
    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledThrice
    ).to.be.true
  })

  it('should call isLoopNeededToBreak with options.label each loop', () => {
    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.isLoopNeededToBreak
        .withArgs(label).calledThrice
    ).to.be.true
  })

  it('should break loop if isLoopNeededToBreak returns true', () => {
    esprimaParser.isLoopNeededToBreak
      .onCall(1).returns(true)

    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledTwice
    ).to.be.true
  })

  it('should break loop if test fails', () => {
    setTestResults([true, true, false])

    esprimaParser.ForStatement(forStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledTwice
    ).to.be.true
  })

  const setParseNodeResults = () => {
    for (const index of tests.keys()) {
      esprimaParser.parseNode
        .withArgs(forStatement.body)
          .onCall(index).returns(`resultFromParseNode${index + 1}`)
    }
  }

  it('should return result from last parseNode called with body given loop never breaks', () => {
    setParseNodeResults()

    const result = esprimaParser.ForStatement(forStatement, options)

    expect(result).to.be.equal('resultFromParseNode3')
  })

  it('should return result from second parseNode called with body given loop breaks at second loop', () => {
    setParseNodeResults()
    esprimaParser.isLoopNeededToBreak
      .onCall(1).returns(true)

    const result = esprimaParser.ForStatement(forStatement, options)

    expect(result).to.be.equal('resultFromParseNode2')
  })
})
