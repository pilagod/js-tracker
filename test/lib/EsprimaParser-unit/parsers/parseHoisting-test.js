describe('parseHoisting tests', () => {
  let statement

  describe('FunctionDeclaration', () => {
    it('should return an array concating result from getNameFromPattern called with its id', () => {
      statement = createAstNode('FunctionDeclaration', {
        id: createAstNode('Identifier')
      })
      sandbox.stub(esprimaParser, 'getNameFromPattern').returns('var1')

      const result = esprimaParser.parseHoisting(statement)

      expect(
        esprimaParser.getNameFromPattern
          .calledWithExactly(statement.id)
      ).to.be.true
      expect(result).to.be.eql(['var1'])
    })
  })

  describe('VariableDeclaration', () => {
    beforeEach(() => {
      statement = createAstNode('VariableDeclaration')

      sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration')
        .returns(['var1', 'var2'])
    })

    it('should return result from getNameFromVariableDeclaration called with it given its kind is var', () => {
      statement.kind = 'var'

      const result = esprimaParser.parseHoisting(statement)

      expect(
        esprimaParser.getNameFromVariableDeclaration
          .calledWithExactly(statement)
      ).to.be.true
      expect(result).to.be.eql(['var1', 'var2'])
    })

    it('should return empty array given its kind is not var', () => {
      statement.kind = 'let/const'

      const result = esprimaParser.parseHoisting(statement)

      expect(esprimaParser.getNameFromVariableDeclaration.called).to.be.false
      expect(result).to.be.eql([])
    })
  })

  describe('Other', () => {
    it('should return result from searchSubHoistings called with other statement', () => {
      statement = createAstNode('Statement')

      sandbox.stub(esprimaParser, 'searchSubHoistings')
        .returns(['var1', 'var2'])

      const result = esprimaParser.parseHoisting(statement)

      expect(
        esprimaParser.searchSubHoistings
          .calledWithExactly(statement)
      ).to.be.true
      expect(result).to.be.eql(['var1', 'var2'])
    })
  })
})
