describe('transformExpressionToData tests', () => {
  for (const type of ['MemberExpression', 'CallExpression']) {
    it(`should call parse${type} with expression and return`, () => {
      const expression = createAstNode(type)
      
      sandbox.stub(esprimaParser, `parse${type}`)
        .returns(`resultFromParse${type}`)

      const result = esprimaParser.transformExpressionToData(expression)

      expect(
        esprimaParser[`parse${type}`]
          .calledWithExactly(expression)
      ).to.be.true
      expect(result).to.be.equal(`resultFromParse${type}`)
    })
  }
})
