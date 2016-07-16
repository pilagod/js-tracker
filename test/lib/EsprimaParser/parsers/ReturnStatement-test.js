// spec: https://github.com/estree/estree/blob/master/spec.md#returnstatement

describe('ReturnStatement tests', () => {
  let returnStatement

  beforeEach(() => {
    returnStatement = createAstNode('ReturnStatement')

    sandbox.stub(esprimaParser, 'status', {
      set: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => {
      return 'parsedArgument'
    }))
  })

  it('should set esprimaParser status to \'return\'', () => {
    esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.status.set
        .calledWithExactly('return')
    ).to.be.true
  })

  it('should call parseNode with argument and return', () => {
    returnStatement.argument = createAstNode()

    const result = esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(returnStatement.argument)
    ).to.be.true
    expect(result).to.be.equal('parsedArgument')
  })

  it('should not call parseNode and return undefined given null argument', () => {
    returnStatement.argument = null

    const result = esprimaParser.ReturnStatement(returnStatement)

    expect(esprimaParser.parseNode.called).to.be.false
    expect(result).to.be.undefined
  })
})
