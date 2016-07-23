describe('getName tests', () => {
  it('should call getNameFromVariableDeclaration with node and return given node type VariableDeclaration', () => {
    const node = createAstNode('VariableDeclaration')

    sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration')
      .returns('resultFromGetNameFromVariableDeclaration')

    const result = esprimaParser.getName(node)

    expect(
      esprimaParser.getNameFromVariableDeclaration
        .calledWithExactly(node)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNameFromVariableDeclaration')
  })

  it('should call getNameFromIdentifier with node and return given node type Identifier', () => {
    const node = createAstNode('Identifier')

    sandbox.stub(esprimaParser, 'getNameFromIdentifier')
      .returns('resultFromGetNameFromIdentifier')

    const result = esprimaParser.getName(node)

    expect(
      esprimaParser.getNameFromIdentifier
        .calledWithExactly(node)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNameFromIdentifier')
  })

  it('should return null given unknown node type', () => {
    const node = createAstNode('UnknownType')

    const result = esprimaParser.getName(node)

    expect(result).to.be.null
  })
})
