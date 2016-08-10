// spec: https://github.com/estree/estree/blob/master/spec.md#returnstatement

describe('ReturnStatement tests', () => {
  let returnStatement

  beforeEach(() => {
    returnStatement = createAstNode('ReturnStatement', {
      argument: createAstNode('Expression')
    })

    sandbox.stub(esprimaParser, 'flowStatus', {
      set: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'parseReturnArgument')
  })

  it('should call parseReturnArgument with argument', () => {
    esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.parseReturnArgument
        .calledWithExactly(returnStatement.argument)
    ).to.be.true
  })

  it('should set flowStatus to \'return\' after parseReturnArgument', () => {
    esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.flowStatus.set
        .calledWithExactly('return')
    ).to.be.true
    expect(
      esprimaParser.flowStatus.set
        .calledAfter(esprimaParser.parseReturnArgument)
    ).to.be.true
  })

  it('should return result from parseReturnArgument', () => {
    esprimaParser.parseReturnArgument.returns('resultFromParseReturnArgument')

    const result = esprimaParser.ReturnStatement(returnStatement)

    expect(result).to.be.equal('resultFromParseReturnArgument')
  })
})
