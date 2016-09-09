// spec: https://github.com/estree/estree/blob/master/spec.md#callexpression

describe('CallExpression tests', () => {
  let callExpression
  // stub results
  const exp = {
    caller: {},
    callee: {},
    info: {}
  }
  // const checkFlag = {}

  beforeEach(() => {
    callexpression = createAstNode('CallExpression')

    sandbox.stub(esprimaParser, 'getCallExp')
      .returns(exp)
    sandbox.stub(esprimaParser, 'parseCallExp')
    // sandbox.stub(esprimaParser, 'createCheckFlag')
    //   .returns(checkFlag)
    // sandbox.stub(esprimaParser, 'setCheckFlag')
    // sandbox.stub(esprimaParser, 'execute')
    // sandbox.stub(esprimaParser, 'resetCheckFlag')
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

  // it('should call createCheckFlag with exp', () => {
  //   esprimaParser.CallExpression(callExpression)
  //
  //   expect(
  //     esprimaParser.createCheckFlag
  //       .calledWithExactly(exp)
  //   ).to.be.true
  // })
  //
  // it('should call setCheckFlag with exp and checkFlag', () => {
  //   esprimaParser.CallExpression(callExpression)
  //
  //   expect(
  //     esprimaParser.setCheckFlag
  //       .calledWithExactly(exp, checkFlag)
  //   ).to.be.true
  // })
  //
  // it('should call execute with exp after setCheckFlag', () => {
  //   esprimaParser.CallExpression(callExpression)
  //
  //   expect(
  //     esprimaParser.execute
  //       .calledAfter(esprimaParser.setCheckFlag)
  //   ).to.be.true
  //   expect(
  //     esprimaParser.execute
  //       .calledWithExactly(exp)
  //   ).to.be.true
  // })
  //
  // it('should call resetCheckFlag with checkFlag after execute', () => {
  //   esprimaParser.CallExpression(callExpression)
  //
  //   expect(
  //     esprimaParser.resetCheckFlag
  //       .calledAfter(esprimaParser.execute)
  //   ).to.be.true
  //   expect(
  //     esprimaParser.resetCheckFlag
  //       .calledWithExactly(checkFlag)
  //   ).to.be.true
  // })
  //
  // it('should return result from execute', () => {
  //   const resultFromExecute = 'resultFromExecute'
  //
  //   esprimaParser.execute.returns(resultFromExecute)
  //
  //   const result = esprimaParser.CallExpression(callExpression)
  //
  //   expect(result).to.be.equal(resultFromExecute)
  // })
})
