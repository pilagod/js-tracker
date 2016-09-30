describe('isHoistingStatement tests', () => {
  let statement

  describe('FunctionDeclaration', () => {
    beforeEach(() => {
      statement = createAstNode('FunctionDeclaration')

      sandbox.stub(esprimaParser, 'parseNode')
    })

    it('should call parseNode with statement', () => {
      esprimaParser.isHoistingStatement(statement)

      expect(
        esprimaParser.parseNode
          .calledWithExactly(statement)
      ).to.be.true
    })

    it('should return true', () => {
      const result = esprimaParser.isHoistingStatement(statement)

      expect(result).to.be.true
    })
  })

  describe('VariableDeclaration', () => {
    beforeEach(() => {
      statement = createAstNode('VariableDeclaration')

      sandbox.stub(esprimaParser, 'initVariableDeclaration')
    })

    it('should call initVariableDeclaration with statement', () => {
      esprimaParser.isHoistingStatement(statement)

      expect(
        esprimaParser.initVariableDeclaration
          .calledWithExactly(statement)
      ).to.be.true
    })

    it('should return false', () => {
      const result = esprimaParser.isHoistingStatement(statement)

      expect(result).to.be.false
    })
  })

  describe('Other Statements', () => {
    beforeEach(() => {
      statement = createAstNode('Statement')
    })

    it('should return false', () => {
      const result = esprimaParser.isHoistingStatement(statement)

      expect(result).to.be.false
    })
  })
})
