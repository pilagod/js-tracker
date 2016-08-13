describe('checkAndExecuteReducer tests', () => {
  const info = {
    code: 'code',
    loc: 'loc'
  }
  const resultStack = ['result1', 'result2', 'result3']
  const curExp = 'curExp'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getLastElementOfStack')
      .returns('resultFromGetLastElementOfStack')
    sandbox.stub(esprimaParser, 'getCurExpStatus')
      .returns('resultFromGetCurExpStatus')
    sandbox.stub(esprimaParser, 'handleCurExpStatus')
  })

  it('should call getLastElementOfStack with resultStack', () => {
    esprimaParser.checkAndExecuteReducer(info, resultStack, curExp)

    expect(
      esprimaParser.getLastElementOfStack
        .calledWithExactly(resultStack)
    ).to.be.true
  })

  it('should call getCurExpStatus with result from getLastElementOfStack and curExp', () => {
    esprimaParser.checkAndExecuteReducer(info, resultStack, curExp)

    expect(
      esprimaParser.getCurExpStatus
        .calledWithExactly('resultFromGetLastElementOfStack', curExp)
    ).to.be.true
  })

  it('should call handleCurExpStatus with info, resultStack and result from getCurExpStatus', () => {
    esprimaParser.checkAndExecuteReducer(info, resultStack, curExp)

    expect(
      esprimaParser.handleCurExpStatus
        .calledWithExactly(info, resultStack, 'resultFromGetCurExpStatus')
    ).to.be.true
  })

  it('should return resultStack', () => {
    const result = esprimaParser.checkAndExecuteReducer(info, resultStack, curExp)

    expect(result).to.be.equal(resultStack)
  })
})
