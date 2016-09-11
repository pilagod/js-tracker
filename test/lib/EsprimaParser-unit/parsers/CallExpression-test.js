// spec: https://github.com/estree/estree/blob/master/spec.md#callexpression

describe('CallExpression tests', () => {
  let callExpression
  // stub results
  const exp = {
    caller: {},
    callee: {}
  }
  const info = {}

  beforeEach(() => {
    delete exp.info // init exp

    callexpression = createAstNode('CallExpression')

    sandbox.stub(esprimaParser, 'getCallExp').returns(exp)
    sandbox.stub(esprimaParser, 'getExpInfo').returns(info)
    sandbox.stub(esprimaParser, 'parseCallExp')
  })

  it('should call getCallExp with callExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(
      esprimaParser.getCallExp
        .calledWithExactly(callExpression)
    ).to.be.true
  })

  it('should set exp.info to result from getExpInfo called with callExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(
      esprimaParser.getExpInfo
        .calledWithExactly(callExpression)
    ).to.be.true
    expect(exp.info).to.be.equal(info)
  })

  it('should call parseCallExp with exp (after assigned info) and return', () => {
    const resultFromParseCallExp = 'resultFromParseCallExp'

    esprimaParser.parseCallExp
      .returns(resultFromParseCallExp)

    const result = esprimaParser.CallExpression(callExpression)

    expect(exp.info).to.be.equal(info)
    expect(
      esprimaParser.parseCallExp
        .calledWithExactly(exp)
    ).to.be.true
    expect(result).to.be.equal(resultFromParseCallExp)
  })
})
