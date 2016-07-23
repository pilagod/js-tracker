describe('getNameFromVariableDeclaration tests', () => {
  let variableDeclaration

  beforeEach(() => {
    variableDeclaration = createAstNode('VariableDeclaration', {
      declarations: [
        createAstNode('VariableDeclarator', {
          id: createAstNode('Pattern')
        })
      ]
    })

    sandbox.stub(esprimaParser, 'getName')
      .returns('resultFromGetName')
  })

  it('should call getName with first VariableDeclarator\' id in declarations and return', () => {
    const result = esprimaParser.getNameFromVariableDeclaration(variableDeclaration)

    expect(
      esprimaParser.getName
        .calledWithExactly(variableDeclaration.declarations[0].id)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetName')
  })
})
