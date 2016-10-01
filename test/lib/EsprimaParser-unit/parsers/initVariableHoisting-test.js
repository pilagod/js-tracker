describe('initVariableHoisting tests', () => {
  const variables = ['var1', 'var2', 'var3']
  let variableDeclaration

  beforeEach(() => {
    variableDeclaration = createAstNode('VariableDeclaration')

    sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration').returns(variables)
    sandbox.stub(esprimaParser, 'initHoisting')
  })

  describe('kind of var', () => {
    beforeEach(() => {
      variableDeclaration.kind = 'var'
    })

    it('should call getNameFromVariableDeclaration with variableDeclaration', () => {
      esprimaParser.initVariableHoisting(variableDeclaration)

      expect(
        esprimaParser.getNameFromVariableDeclaration
          .calledWithExactly(variableDeclaration)
      ).to.be.true
    })

    it('should call initHoisting with each element in result from getNameFromVariableDeclaration', () => {
      esprimaParser.initVariableHoisting(variableDeclaration)

      expect(esprimaParser.initHoisting.calledThrice).to.be.true

      for (const [index, variable] of variables.entries()) {
        expect(
          esprimaParser.initHoisting.getCall(index)
            .calledWithExactly(variable)
        ).to.be.true
      }
    })
  })

  describe('kind of other', () => {
    beforeEach(() => {
      variableDeclaration.kind = 'let' // or const
    })

    it('should do nothing', () => {
      esprimaParser.initVariableHoisting(variableDeclaration)

      expect(esprimaParser.getNameFromVariableDeclaration.called).to.be.false
      expect(esprimaParser.initHoisting.called).to.be.false
    })
  })
})
