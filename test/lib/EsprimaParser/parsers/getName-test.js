describe('getName tests', () => {
  describe('VariableDeclaration', () => {
    let node

    beforeEach(() => {
      node = createAstNode('VariableDeclaration')

      sandbox.stub(esprimaParser, 'parseNode')
      sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration')
        .returns('resultFromGetNameFromVariableDeclaration')
    })

    it('should call parseNode with node before getNameFromVariableDeclaration', () => {
      esprimaParser.getName(node)

      expect(
        esprimaParser.parseNode
          .calledWithExactly(node)
      ).to.be.true
      expect(
        esprimaParser.parseNode
          .calledBefore(
            esprimaParser.getNameFromVariableDeclaration
          )
      ).to.be.true
    })

    it('should call getNameFromVariableDeclaration with node and return', () => {
      const result = esprimaParser.getName(node)

      expect(
        esprimaParser.getNameFromVariableDeclaration
          .calledWithExactly(node)
      ).to.be.true
      expect(result).to.be.equal('resultFromGetNameFromVariableDeclaration')
    })
  })

  it('should return node name given node type Identifier', () => {
    const node = createAstNode('Identifier', {
      name: 'name of Identifier'
    })

    const result = esprimaParser.getName(node)

    expect(result).to.be.equal(node.name)
  })

  it('should return null given unknown node type', () => {
    const node = createAstNode('UnknownType')

    const result = esprimaParser.getName(node)

    expect(result).to.be.null
  })
})
