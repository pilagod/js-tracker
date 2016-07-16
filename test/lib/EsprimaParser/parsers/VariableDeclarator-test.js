// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclarator

describe('VariableDeclarator tests', () => {
  let variableDeclarator

  beforeEach(() => {
    variableDeclarator = createAstNode('VariableDeclarator', {
      id: createAstNode('Identifier', {name: 'variableName'}),
      init: createAstNode('Expression')
    })

    sandbox.stub(esprimaParser, 'closureStack', {
      set: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should call parseNode with init given non-null init', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(variableDeclarator.init)
    ).to.be.true
  })

  it('should call set of closureStack with id name and init value, given non-null init', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.closureStack.set
        .calledWithExactly('variableName', 'parsedExpression')
    ).to.be.true
  })

  it('should not call parseNode with init given null init', () => {
    variableDeclarator.init = null

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(esprimaParser.parseNode.callCount).to.be.equal(0)
  })

  it('should call set of closureStack with id name and undefined, given null init', () => {
    variableDeclarator.init = null

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.closureStack.set
        .calledWithExactly('variableName', undefined)
    ).to.be.true
  })
})
