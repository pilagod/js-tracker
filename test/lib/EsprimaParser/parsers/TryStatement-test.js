// spec: https://github.com/estree/estree/blob/master/spec.md#trystatement

describe('TryStatement tests', () => {
  const error = new Error('error from block')

  let tryStatement

  beforeEach(() => {
    tryStatement = createAstNode('TryStatement', {
      block: createAstNode('BlockStatementBlock'),
      handler: createAstNode('CatchClause'),
      finalizer: createAstNode('BlockStatementFinalizer')
    })

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'handleCatchClause')
    sandbox.stub(esprimaParser, 'handleFinalizer')
  })

  it('should call parseNode with block', () => {
    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(tryStatement.block).called
    ).to.be.true
  })

  it('should call handleCatchClause with handler and error throws from block', () => {
    esprimaParser.parseNode
      .withArgs(tryStatement.block)
        .throws(error)

    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.handleCatchClause
        .calledWithExactly(tryStatement.handler, error)
    ).to.be.true
  })

  it('should not call handleCatchClause given no error threw from block', () => {
    esprimaParser.TryStatement(tryStatement)

    expect(esprimaParser.handleCatchClause.called).to.be.false
  })

  it('should call handleFinalizer given no error', () => {
    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.handleFinalizer
        .withArgs(tryStatement.finalizer).called
    ).to.be.true
  })

  it('should call handleFinalizer given error threw from block', () => {
    esprimaParser.parseNode
      .withArgs(tryStatement.block)
        .throws(error)

    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.handleFinalizer
        .withArgs(tryStatement.finalizer).called
    ).to.be.true
  })

  it('should return last valid value', () => {
    let results = []

    /* try return value, finally no return */
    esprimaParser.parseNode
      .returns('resultFromParseNode')

    results.push(esprimaParser.TryStatement(tryStatement))

    /* try throws error, catch return value, finally no return */
    esprimaParser.parseNode
      .throws(error)
    esprimaParser.handleCatchClause
      .returns('resultFromHandleCatchClause')

    results.push(esprimaParser.TryStatement(tryStatement))

    /* try throws error, catch and finally return value */
    esprimaParser.handleFinalizer
      .returns('resultFromHandleFinalizer')

    results.push(esprimaParser.TryStatement(tryStatement))

    /* try and finally return value */
    esprimaParser.parseNode
      .returns('resultFromParseNode')

    results.push(esprimaParser.TryStatement(tryStatement))

    expect(results).to.be.eql([
      'resultFromParseNode',
      'resultFromHandleCatchClause',
      'resultFromHandleFinalizer',
      'resultFromHandleFinalizer',
    ])
  })
})
