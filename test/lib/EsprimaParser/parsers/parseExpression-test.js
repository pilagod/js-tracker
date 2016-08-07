describe('parseExpression tests', () => {
  let expression

  beforeEach(() => {
    expression = createAstNode('MemberOrCallExpression')

    sandbox.stub(esprimaParser, 'transformExpressionToData')
      .returns('resultFromTransformExpressionToData')
    sandbox.stub(esprimaParser, 'parseExpressionInfo')
      .returns('resultFromParseExpressionInfo')
  })

  it('should call transformExpressionToData with expression', () => {
    esprimaParser.parseExpression(expression)

    expect(
      esprimaParser.transformExpressionToData
        .calledWithExactly(expression)
    ).to.be.true
  })

  it('should call parseExpressionInfo with expression', () => {
    esprimaParser.parseExpression(expression)

    expect(
      esprimaParser.parseExpressionInfo
        .calledWithExactly(expression)
    ).to.be.true
  })

  it('should return an object containing result from above', () => {
    const result = esprimaParser.parseExpression(expression)

    expect(result).to.be.eql({
      data: 'resultFromTransformExpressionToData',
      info: 'resultFromParseExpressionInfo'
    })
  })
  // beforeEach(() => {
  //   sandbox.stub(esprimaParser, 'parseMemberExpression')
  //     .returns('resultFromParseMemberExpression')
  //   sandbox.stub(esprimaParser, 'parseCallExpression')
  //     .returns('resultFromParseCallExpression')
  //   sandbox.stub(esprimaParser, 'escodegen')
  //     .returns('resultFromEscodegen')
  // })
  //
  // for (const type of ['MemberExpression', 'CallExpression']) {
  //   describe(`${type}`, () => {
  //     let node
  //
  //     beforeEach(() => {
  //       node = createAstNode(type, {
  //         loc: 'location'
  //       })
  //     })
  //
  //     it(`should call parse${type} given node type ${type}`, () => {
  //       esprimaParser.parseExpression(node)
  //
  //       expect(
  //         esprimaParser[`parse${type}`]
  //           .calledWithExactly(node)
  //       ).to.be.true
  //     })
  //
  //     it(`should return an object containing data from parse${type} and info of node loc and code`, () => {
  //       const info = {
  //         loc: 'location',
  //         code: 'resultFromEscodegen'
  //       }
  //
  //       const result = esprimaParser.parseExpression(node)
  //
  //       expect(result).to.be.eql({
  //         data: `resultFromParse${type}`,
  //         info: info
  //       })
  //     })
  //   })
  // }
})
