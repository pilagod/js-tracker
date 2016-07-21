// spec: https://github.com/estree/estree/blob/master/spec.md#forstatement

describe('ForStatement tests', () => {
  const setTestResults = (results) => {
    const getTestResults = createResultsGenerator(results)

    for (const index of results.keys()) {
      esprimaParser.parseNode
        .withArgs(forStatement.test)
          .onCall(index).returns(getTestResults())
    }
  }
  const setCheckStatusResults = (method, results) => {
    esprimaParser.status[method] =
      sandbox.spy(createResultsGenerator(results))
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
    sandbox.stub(esprimaParser, 'status', {
      unset: sandbox.spy(),
      isLoopBreakStatus: () => {},
      isLoopContinueStatus: () => {}
    })
  })

  it('should call parseNode with init', () => {
    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(forStatement.init)
    ).to.be.true
  })

  it('should call parseNode with test until test fails', () => {
    setTestResults([true, true, false, true, true])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.test).calledThrice
    ).to.be.true
  })

  it('should call parseNode with update each time test passes', () => {
    setTestResults([true, true, false])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.update).calledTwice
    ).to.be.true
  })

  it('should call parseNode with body each time test passes', () => {
    setTestResults([true, true, false])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledTwice
    ).to.be.true
  })

  it('should call isLoopBreakStatus of esprimaParser status after parsing body each time test passes', () => {
    setTestResults([true, true, false])
    setCheckStatusResults('isLoopBreakStatus', [false, false, false])

    esprimaParser.ForStatement(forStatement)

    for (let i = 0; i < 2; i += 1) {
      expect(
        esprimaParser.status.isLoopBreakStatus
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(forStatement.body)
              .getCall(i)
          )
      ).to.be.true
    }
    expect(esprimaParser.status.isLoopBreakStatus.calledTwice).to.be.true
  })

  it('should call isLoopContinueStatus of esprimaParser status after parsing body each time test passes', () => {
    setTestResults([true, true, false])
    setCheckStatusResults('isLoopContinueStatus', [false, false, false])

    esprimaParser.ForStatement(forStatement)

    for (let i = 0; i < 2; i += 1) {
      expect(
        esprimaParser.status.isLoopContinueStatus
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(forStatement.body)
              .getCall(i)
          )
      ).to.be.true
    }
    expect(esprimaParser.status.isLoopContinueStatus.calledTwice).to.be.true
  })

  it('should break the loop and unset break status given isLoopBreakStatus returns true', () => {
    setTestResults([true, true, true])
    setCheckStatusResults('isLoopBreakStatus', [false, true, false])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledTwice
    ).to.be.true
    expect(
      esprimaParser.status.unset
        .calledWithExactly('break')
    ).to.be.true
  })

  it('should continue the loop and unset continue status given isLoopContinueStatus returns true', () => {
    setTestResults([true, true, true])
    setCheckStatusResults('isLoopContinueStatus', [false, true, false])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledThrice
    ).to.be.true
    expect(
      esprimaParser.status.unset
        .calledWithExactly('continue')
    ).to.be.true
  })

  it('should return parsed body result', () => {
    setTestResults([true])
    esprimaParser.parseNode
      .withArgs(forStatement.body)
        .returns('parsedStatement')

    const result = esprimaParser.ForStatement(forStatement)

    expect(result).to.be.equal('parsedStatement')
  })

  it('should return undefined given test fails from beginning', () => {
    setTestResults([false])

    const result = esprimaParser.ForStatement(forStatement)

    expect(result).to.be.undefined
    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).called
    ).to.be.false
    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.update).called
    ).to.be.false
  })
})
