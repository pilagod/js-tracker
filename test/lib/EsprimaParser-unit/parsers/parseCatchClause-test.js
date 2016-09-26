describe('parseCatchClause tests', () => {
  const error = new Error()
  let catchClause

  beforeEach(() => {
    catchClause = createAstNode('CatchClause', {
      param: createAstNode('Identifier'),
      body: createAstNode('BlockStatement')
    })
    sandbox.stub(esprimaParser, 'setCatchError')
    sandbox.stub(esprimaParser, 'handleExceptionBlock')
      .returns('resultFromHandleExceptionBlock')
  })

  it('should call setCatchError with catchClause.param and error', () => {
    esprimaParser.parseCatchClause(catchClause, error)

    expect(
      esprimaParser.setCatchError
        .calledWithExactly(catchClause.param, error)
    ).to.be.true
  })

  it('should call handleExceptionBlock with catchClause.body after setCatchError and return', () => {
    const result = esprimaParser.parseCatchClause(catchClause, error)

    expect(
      esprimaParser.handleExceptionBlock
        .calledAfter(esprimaParser.setCatchError)
    ).to.be.true
    expect(
      esprimaParser.handleExceptionBlock
        .calledWithExactly(catchClause.body)
    ).to.be.true
    expect(result).to.be.equal('resultFromHandleExceptionBlock')
  })
})
