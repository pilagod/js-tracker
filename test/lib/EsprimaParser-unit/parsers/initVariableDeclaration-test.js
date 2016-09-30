describe('initVariableDeclaration tests', () => {
  const variables = ['var1', 'var2', 'var3']
  let variableDeclaration

  beforeEach(() => {
    variableDeclaration = createAstNode('VariableDeclaration')

    sandbox.stub(esprimaParser, 'getNameFromVariableDeclaration')
      .returns(variables)
    sandbox.stub(esprimaParser, 'setVariables')
  })

  describe('kind of var', () => {
    beforeEach(() => {
      variableDeclaration.kind = 'var'
    })

    it('should call getNameFromVariableDeclaration with variableDeclaration', () => {
      esprimaParser.initVariableDeclaration(variableDeclaration)

      expect(
        esprimaParser.getNameFromVariableDeclaration
          .calledWithExactly(variableDeclaration)
      ).to.be.true
    })

    it('should call setVariables with each element in result from getNameFromVariableDeclaration and undefined', () => {
      esprimaParser.initVariableDeclaration(variableDeclaration)

      expect(esprimaParser.setVariables.calledThrice).to.be.true

      for (const [index, variable] of variables.entries()) {
        expect(
          esprimaParser.setVariables.getCall(index)
            .calledWithExactly(variable, undefined)
        ).to.be.true
      }
    })
  })

  describe('kind of other', () => {
    beforeEach(() => {
      variableDeclaration.kind = 'let' // or const
    })

    it('should do nothing', () => {
      esprimaParser.initVariableDeclaration(variableDeclaration)

      expect(esprimaParser.getNameFromVariableDeclaration.called).to.be.false
      expect(esprimaParser.setVariables.called).to.be.false
    })
  })
})
