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
    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should set flowStatus to \'return\'', () => {
    esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.flowStatus.set
        .calledWithExactly('return')
    ).to.be.true
  })

  it('should call parseNode with argument and return', () => {
    const result = esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(returnStatement.argument)
    ).to.be.true
    expect(result).to.be.equal('parsedExpression')
  })

  it('should not call parseNode and return undefined given null argument', () => {
    returnStatement.argument = null

    const result = esprimaParser.ReturnStatement(returnStatement)

    expect(esprimaParser.parseNode.called).to.be.false
    expect(result).to.be.undefined
  })
})
