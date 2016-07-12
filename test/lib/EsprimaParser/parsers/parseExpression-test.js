describe('parseExpression tests', () => {
  class ExpressionStub {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseMemberExpression', sandbox.spy(() => {
      return 'resultFromParseMemberExpression'
    }))
    sandbox.stub(esprimaParser, 'parseCallExpression', sandbox.spy(() => {
      return 'resultFromParseCallExpression'
    }))
    sandbox.stub(esprimaParser, 'escodegen', sandbox.spy(() => {
      return 'escodegenCodeText'
    }))
    sandbox.stub(esprimaParser, 'Expression', sandbox.spy(() => {
      return new ExpressionStub()
    }))
  })

  for (const type of ['MemberExpression', 'CallExpression']) {
    describe(`${type} tests`, () => {
      let node

      beforeEach(() => {
        node = createAstNode(type, {
          loc: 'nodeLocationInfo'
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
          code: 'escodegenCodeText',
          loc: 'nodeLocationInfo'
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
