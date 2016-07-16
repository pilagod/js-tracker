// spec: https://github.com/estree/estree/blob/master/spec.md#whilestatement

describe('WhileStatement tests', () => {
  let whileStatement

  const setTestResults = (results) => {
    const getTestResults = createResultsGenerator(results)

    for (const index of results.keys()) {
      esprimaParser.parseNode
        .withArgs(whileStatement.test)
          .onCall(index).returns(getTestResults())
    }
  }

  const setCheckStatusResults = (method, results) => {
    esprimaParser.status[method] =
      sandbox.spy(createResultsGenerator(results))
  }

  beforeEach(() => {
    whileStatement = createAstNode('WhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'status', {
      unset: sandbox.spy(),
      isLoopBreakStatus: () => {},
      isLoopContinueStatus: () => {}
    })
  })

  it('should call parseNode with test until test fails', () => {
    setTestResults([true, true, false, true, true])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.test).calledThrice
    ).to.be.true
  })

  it('should call parseNode with body each time test passes', () => {
    setTestResults([true, true, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
  })

  it('should call isLoopBreakStatus of esprimaParser status each time test passes', () => {
    setTestResults([true, true, false])
    setCheckStatusResults('isLoopBreakStatus', [false, false, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(esprimaParser.status.isLoopBreakStatus.calledTwice).to.be.true
  })

  it('should call isLoopContinueStatus of esprimaParser status each time test passes', () => {
    setTestResults([true, true, false])
    setCheckStatusResults('isLoopContinueStatus', [false, false, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(esprimaParser.status.isLoopContinueStatus.calledTwice).to.be.true
  })

  it('should break the loop and unset break status given isLoopBreakStatus returns true', () => {
    setTestResults([true, true, true])
    setCheckStatusResults('isLoopBreakStatus', [false, true, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
    expect(
      esprimaParser.status.unset
        .calledWithExactly('break')
    ).to.be.true
  })

  it('should continue the loop and unset continue status given isLoopContinueStatus returns true', () => {
    setTestResults([true, true, true])
    setCheckStatusResults('isLoopContinueStatus', [false, true, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledThrice
    ).to.be.true
    expect(
      esprimaParser.status.unset
        .calledWithExactly('continue')
    ).to.be.true
  })

  it('should return parsed body result', () => {
    setTestResults([true])
    esprimaParser.parseNode
      .withArgs(whileStatement.body).returns('parsedStatement')

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.equal('parsedStatement')
  })

  it('should return undefined given test fails from beginning', () => {
    setTestResults([false])

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.undefined
  })
})
