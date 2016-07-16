describe('parseExpression tests', () => {
  class ExpressionStub {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseMemberExpression')
      .returns('resultFromParseMemberExpression')
    sandbox.stub(esprimaParser, 'parseCallExpression')
      .returns('resultFromParseCallExpression')
    sandbox.stub(esprimaParser, 'escodegen')
      .returns('resultFromEscodegen')
    sandbox.stub(esprimaParser, 'Expression', () => {
      return new ExpressionStub()
    })
  })

  for (const type of ['MemberExpression', 'CallExpression']) {
    describe(`${type}`, () => {
      let node

      beforeEach(() => {
        node = createAstNode(type, {
          loc: 'location'
        })
      })

      it(`should call parse${type} given node type ${type}`, () => {
        esprimaParser.parseExpression(node)

        expect(
          esprimaParser[`parse${type}`]
            .calledWithExactly(node)
        ).to.be.true
      })

      it(`should return a new Expression object with result from parse${type} and node info`, () => {
        const nodeInfo = {
          code: 'resultFromEscodegen',
          loc: 'location'
        }

        const result = esprimaParser.parseExpression(node)

        expect(
          esprimaParser.escodegen
            .calledWithExactly(node)
        ).to.be.true
        expect(
          esprimaParser.Expression
            .calledWithExactly(`resultFromParse${type}`, nodeInfo)
        ).to.be.true
        expect(result).to.be.instanceof(ExpressionStub)
      })
    })
  }
})
