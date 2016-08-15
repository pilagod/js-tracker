describe('checkAndExecuteReducer tests', () => {
  const info = {
    code: 'code',
    loc: 'loc'
  }
  const calleeStack = ['callee1', 'callee2', 'callee3']
  const callee = calleeStack.slice(-1)[0]
  const expression = 'expression'
  const statusStub = {
    type: 'STATE'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'callChecker', {
      dispatch: sandbox.stub().returns(statusStub)
    })
    sandbox.stub(esprimaParser, 'addAffectedElementToCollection')
    sandbox.stub(esprimaParser, 'updateCalleeStack')
  })

  it('should call dispatch of callChecker with last element of calleeStack and expression', () => {
    esprimaParser.checkAndExecuteReducer(info, calleeStack, expression)

    expect(
      esprimaParser.callChecker.dispatch
        .calledWithExactly(callee, expression)
    ).to.be.true
  })

  it('should call addAffectedElementToCollection with info, callee, expression, and status got from callChecker', () => {
    esprimaParser.checkAndExecuteReducer(info, calleeStack, expression)

    expect(
      esprimaParser.addAffectedElementToCollection
        .calledWithExactly(info, callee, expression, statusStub)
    ).to.be.true
  })

  it('should call updateCalleeStack with calleeStack, callee, expression, status', () => {
    esprimaParser.checkAndExecuteReducer(info, calleeStack, expression)

    expect(
      esprimaParser.updateCalleeStack
        .calledWithExactly(calleeStack, callee, expression, statusStub)
    ).to.be.true
  })

  it('should return calleeStack', () => {
    const result = esprimaParser.checkAndExecuteReducer(info, calleeStack, expression)

    expect(result).to.be.equal(calleeStack)
  })
})
