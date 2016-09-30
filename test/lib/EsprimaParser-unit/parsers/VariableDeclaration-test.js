// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclaration

describe('VariableDeclaration tests', () => {
  let variableDeclaration

  beforeEach(() => {
    variableDeclaration = createAstNode('VariableDeclaration', {
      kind: 'var/let/const',
      declarations: [
        createAstNode('VariableDeclarator1'),
        createAstNode('VariableDeclarator2'),
        createAstNode('VariableDeclarator3')
      ]
    })
    sandbox.stub(esprimaParser, 'VariableDeclarator')
  })

  it('should call VariableDeclarator with each node in declarations and variableDeclaration.kind', () => {
    esprimaParser.VariableDeclaration(variableDeclaration)

    expect(esprimaParser.VariableDeclarator.calledThrice).to.be.true

    for (const [index, declaration] of variableDeclaration.declarations.entries()) {
      expect(
        esprimaParser.VariableDeclarator.getCall(index)
          .calledWithExactly(declaration, variableDeclaration.kind)
      ).to.be.true
    }
  })
})
