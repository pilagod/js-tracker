// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclarator

describe('VariableDeclarator tests', () => {
  let variableDeclarator

  beforeEach(() => {
    variableDeclarator = createAstNode('VariableDeclarator', {
      id: createAstNode('Identifier', {
        name: 'name'
      }),
      init: createAstNode('Expression')
    })

    sandbox.stub(esprimaParser, 'getName')
      .returns('variables')
    sandbox.stub(esprimaParser, 'parseNode')
      .returns('values')
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call getName with id', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.getName
        .calledWithExactly(variableDeclarator.id)
    ).to.be.true
  })

  it('should call parseNode with init given non-null init', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(variableDeclarator.init)
    ).to.be.true
  })

  it('should call setVariables with variables from getName and values from parseNode given non-null init', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('variables', 'values')
    ).to.be.true
  })

  it('should call setVariables with variables from getName and undefined given null init', () => {
    variableDeclarator.init = null

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('variables', undefined)
    ).to.be.true
  })
})
