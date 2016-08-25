describe('checkAndExecuteReducer tests', () => {
  const info = {}
  const caller = 'caller'
  const callee = 'callee'
  // stub results
  const contextStub = 'contextStub'
  const statusStub = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', contextStub)
    sandbox.stub(esprimaParser, 'callChecker', {
      dispatch: sandbox.stub().returns(statusStub)
    })
    sandbox.stub(esprimaParser, 'addInfoToCollection')
    sandbox.stub(esprimaParser, 'getNextCaller')
      .returns('resultFromGetNextCaller')
  })

  it('should call dispatch of callChecker with an object containing context, caller and callee', () => {
    esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(
      esprimaParser.callChecker.dispatch
        .calledWithExactly({
          caller,
          callee,
          context: esprimaParser.context
        })
    ).to.be.true
  })

  it('should call addInfoToCollection with caller, callee, info and status given non-undefined status', () => {
    esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(
      esprimaParser.addInfoToCollection
        .calledWithExactly(caller, callee, info, statusStub)
    ).to.be.true
  })

  it('should not call addInfoToCollection given undefined status', () => {
    esprimaParser.callChecker.dispatch.returns(undefined)

    esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(esprimaParser.addInfoToCollection.called).to.be.false
  })

  it('should call getNextCallee with caller, callee and status then return', () => {
    const result = esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(
      esprimaParser.getNextCaller
        .calledWithExactly(caller, callee, statusStub)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNextCaller')
  })
})
