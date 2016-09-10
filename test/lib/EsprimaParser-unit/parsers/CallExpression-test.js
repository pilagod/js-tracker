// spec: https://github.com/estree/estree/blob/master/spec.md#callexpression

describe('CallExpression tests', () => {
  let callExpression
  // stub results
  const exp = {
    caller: {},
    callee: {},
    info: {}
  }
  beforeEach(() => {
    callexpression = createAstNode('CallExpression')

    sandbox.stub(esprimaParser, 'getCallExp')
      .returns(exp)
    sandbox.stub(esprimaParser, 'parseCallExp')
  })

  it('should call getCallExp with callExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(
      esprimaParser.getCallExp
        .calledWithExactly(callExpression)
    ).to.be.true
  })

  it('should call parseCallExp with exp and return', () => {
    const resultFromParseCallExp = 'resultFromParseCallExp'

    esprimaParser.parseCallExp
      .returns(resultFromParseCallExp)

    const result = esprimaParser.CallExpression(callExpression)

    expect(
      esprimaParser.parseCallExp
        .calledWithExactly(exp)
    ).to.be.true
    expect(result).to.be.equal(resultFromParseCallExp)
  })
})
