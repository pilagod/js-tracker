// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclaration

describe('VariableDeclaration tests', () => {
  let variableDeclaration

  beforeEach(() => {
    variableDeclaration = createAstNode('VariableDeclaration')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())
  })

  it('should call parseNode with nodes in declarations', () => {
    variableDeclaration.declarations = [
      createAstNode('VariableDeclarator'),
      createAstNode('VariableDeclarator')
    ]

    esprimaParser.VariableDeclaration(variableDeclaration)

    variableDeclaration.declarations.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
  })
})
