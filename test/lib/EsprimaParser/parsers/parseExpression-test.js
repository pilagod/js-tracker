describe('parseExpression tests', () => {
  class ExpressionStub {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseMemberExpression')
      .returns('resultFromParseMemberExpression')
    sandbox.stub(esprimaParser, 'parseCallExpression')
      .returns('resultFromParseCallExpression')
    sandbox.stub(esprimaParser, 'escodegen')
      .returns('resultFromEscodegen')
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

      it(`should return an object containing data from parse${type} and info of node loc and code`, () => {
        const info = {
          loc: 'location',
          code: 'resultFromEscodegen'
        }

        const result = esprimaParser.parseExpression(node)

        expect(result).to.be.eql({
          data: `resultFromParse${type}`,
          info: info
        })
      })
    })
  }
})
