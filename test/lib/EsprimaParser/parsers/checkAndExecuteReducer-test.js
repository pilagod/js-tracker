describe('checkAndExecuteReducer tests', () => {
  const info = {
    code: 'code',
    loc: 'loc'
  }
  const callee = 'callee'
  const expression = 'expression'
  const statusStub = {
    type: 'STATE'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'callChecker', {
      dispatch: sandbox.stub().returns(statusStub)
    })
    sandbox.stub(esprimaParser, 'addInfoToCollection')
    sandbox.stub(esprimaParser, 'getNextCallee')
      .returns('resultFromGetNextCallee')
  })

  it('should call dispatch of callChecker with callee and expression', () => {
    esprimaParser.checkAndExecuteReducer(info, callee, expression)

    expect(
      esprimaParser.callChecker.dispatch
        .calledWithExactly(callee, expression)
    ).to.be.true
  })

  it('should call addInfoToCollection with callee, expression status and info given non-undefined status', () => {
    esprimaParser.checkAndExecuteReducer(info, callee, expression)

    expect(
      esprimaParser.addInfoToCollection
        .calledWithExactly(callee, expression, statusStub, info)
    ).to.be.true
  })

  it('should not call addInfoToCollection given undefined status', () => {
    esprimaParser.callChecker.dispatch.returns(undefined)

    esprimaParser.checkAndExecuteReducer(info, callee, expression)

    expect(esprimaParser.addInfoToCollection.called).to.be.false
  })

  it('should call getNextCallee with callee, expression and status then return', () => {
    const result = esprimaParser.checkAndExecuteReducer(info, callee, expression)

    expect(
      esprimaParser.getNextCallee
        .calledWithExactly(callee, expression, statusStub)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNextCallee')
  })
})
