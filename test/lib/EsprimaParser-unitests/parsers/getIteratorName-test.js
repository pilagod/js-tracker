describe('getIteratorName tests', () => {
  let node

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration')
      .returns('resultFromGetNameFromVariableDeclaration')
    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns('resultFromGetNameFromPattern')
  })

  it('should call getNameFromVariableDeclaration with node and return given node type VariableDeclaration', () => {
    node = createAstNode('VariableDeclaration')

    const result = esprimaParser.getIteratorName(node)

    expect(
      esprimaParser.getNameFromVariableDeclaration
        .calledWithExactly(node)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNameFromVariableDeclaration')
  })

  it('should call getNameFromPattern with node and return given node type other than VariableDeclaration', () => {
    node = createAstNode('Pattern')

    const result = esprimaParser.getIteratorName(node)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(node)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNameFromPattern')
  })
})
