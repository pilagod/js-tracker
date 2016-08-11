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
    sandbox.stub(esprimaParser, 'resetLoopStatus')
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

  it('should call parseNode with body each loop', () => {
    setTestResults([true, true, false])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledTwice
    ).to.be.true
  })

  it('should call resetLoopStatus after parsing body each loop', () => {
    setTestResults([true, true, false])

    esprimaParser.ForStatement(forStatement)

    for (let i = 0; i < 2; i += 1) {
      expect(
        esprimaParser.resetLoopStatus
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(forStatement.body)
              .getCall(i)
          )
      ).to.be.true
    }
    expect(esprimaParser.resetLoopStatus.calledTwice).to.be.true
  })

  it('should break loop given resetLoopStatus returns \'break\' state', () => {
    setTestResults([true, true, true])
    esprimaParser.resetLoopStatus
      .onCall(1).returns('break')

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.body).calledTwice
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.update).calledOnce
    ).to.be.true
  })

  it('should call parseNode with update each loop', () => {
    setTestResults([true, true, false])

    esprimaParser.ForStatement(forStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forStatement.update).calledTwice
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
