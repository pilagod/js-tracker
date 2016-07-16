// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclaration

describe('VariableDeclaration tests', () => {
  let variableDeclaration

  beforeEach(() => {
    variableDeclaration = createAstNode('VariableDeclaration', {
      declarations: [
        createAstNode('VariableDeclarator1'),
        createAstNode('VariableDeclarator2'),
        createAstNode('VariableDeclarator3')
      ]
    })

    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call parseNode with nodes in declarations', () => {
    esprimaParser.VariableDeclaration(variableDeclaration)

    variableDeclaration.declarations.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
    expect(esprimaParser.parseNode.calledThrice).to.be.true
  })
})
