// spec: https://github.com/estree/estree/blob/master/spec.md#trystatement

describe('TryStatement tests', () => {
  let tryStatement

  beforeEach(() => {
    tryStatement = createAstNode('TryStatement', {
      block: createAstNode('BlockStatementBlock'),
      handler: createAstNode('CatchClause'),
      finalizer: createAstNode('BlockStatementFinalizer')
    })

    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call parseNode with block', () => {
    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(tryStatement.block)
    ).to.be.true
  })

  it('should not call parseNode with handler given block not throw error', () => {
    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.parseNode
        .neverCalledWith(tryStatement.handler)
    ).to.be.true
  })

  it('should call getName with ')

  it('should call parseNode with handler given block throw error', () => {
    const error = 'error from block'

    esprimaParser.parseNode
      .withArgs(tryStatement.block)
        .throws(error)

    esprimaParser.TryStatement(tryStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(tryStatement.handler)
    ).to.be.true
  })
})
