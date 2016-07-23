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

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns('resultFromGetNameFromPattern')
  })

  it('should call parseNode with node', () => {
    esprimaParser.getNameFromVariableDeclaration(variableDeclaration)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(variableDeclaration)
    ).to.be.true
  })

  it('should call getNameFromPattern with first VariableDeclarator\'s id in declarations and return', () => {
    const result = esprimaParser.getNameFromVariableDeclaration(variableDeclaration)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(variableDeclaration.declarations[0].id)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNameFromPattern')
  })
})
