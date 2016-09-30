describe('parseIterator tests', () => {
  let node

  describe('VariableDeclaration', () => {
    const variables = ['var1', 'var2', 'var3']

    beforeEach(() => {
      node = createAstNode('VariableDeclaration')

      sandbox.stub(esprimaParser, 'parseNode')
      sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration').returns(variables)
    })

    it('should call parseNode with node', () => {
      esprimaParser.parseIterator(node)

      expect(
        esprimaParser.parseNode
          .calledWithExactly(node)
      ).to.be.true
    })

    it('should call getNameFromVariableDeclaration with node', () => {
      esprimaParser.parseIterator(node)

      expect(
        esprimaParser.getNameFromVariableDeclaration
          .calledWithExactly(node)
      ).to.be.true
    })

    it('should return first element of result from getNameFromVariableDeclaration', () => {
      const result = esprimaParser.parseIterator(node)

      expect(result).to.be.equal(variables[0])
    })
  })

  describe('Pattern', () => {
    const variable = 'var'

    beforeEach(() => {
      node = createAstNode('Identifier')

      sandbox.stub(esprimaParser, 'getNameFromPattern').returns(variable)
    })

    it('should call getNameFromPattern with node and return', () => {
      const result = esprimaParser.parseIterator(node)

      expect(
        esprimaParser.getNameFromPattern
          .calledWithExactly(node)
      ).to.be.true
      expect(result).to.be.equal(variable)
    })
  })
  //
  // it('should call getNameFromVariableDeclaration with node and return given node type VariableDeclaration', () => {
  //   node = createAstNode('VariableDeclaration')
  //
  //   const result = esprimaParser.parseIterator(node)
  //
  //   expect(
  //     esprimaParser.getNameFromVariableDeclaration
  //       .calledWithExactly(node)
  //   ).to.be.true
  //   expect(result).to.be.equal('resultFromGetNameFromVariableDeclaration')
  // })
  //
  // it('should call getNameFromPattern with node and return given node type other than VariableDeclaration', () => {
  //   node = createAstNode('Pattern')
  //
  //   const result = esprimaParser.parseIterator(node)
  //
  //   expect(
  //     esprimaParser.getNameFromPattern
  //       .calledWithExactly(node)
  //   ).to.be.true
  //   expect(result).to.be.equal('resultFromGetNameFromPattern')
  // })
})
