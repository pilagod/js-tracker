describe('checkAndExecuteReducer tests', () => {
  const info = {}
  const caller = {}
  const callee = {}
  const target = {caller, callee, info}
  // stub results
  const context = {}
  const status = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', context)
    sandbox.stub(esprimaParser, 'checkerDispatcher', {
      dispatch: sandbox.stub().returns(status)
    })
    sandbox.stub(esprimaParser, 'addInfoToCollection')
    sandbox.stub(esprimaParser, 'getNextCaller')
      .returns('resultFromGetNextCaller')
  })

  it('should call dispatch of checkerDispatcher with an object containing context and {caller, callee, info}', () => {
    esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(
      esprimaParser.checkerDispatcher.dispatch
        .calledWithExactly(Object.assign({context}, target))
    ).to.be.true
  })

  it('should call addInfoToCollection with {caller, callee, info} and status given non-undefined status', () => {
    esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(
      esprimaParser.addInfoToCollection
        .calledWithExactly(target, status)
    ).to.be.true
  })

  it('should not call addInfoToCollection given undefined status', () => {
    esprimaParser.checkerDispatcher.dispatch.returns(undefined)

    esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(esprimaParser.addInfoToCollection.called).to.be.false
  })

  it('should call getNextCaller with {caller, callee, info} and status then return', () => {
    const result = esprimaParser.checkAndExecuteReducer(info, caller, callee)

    expect(
      esprimaParser.getNextCaller
        .calledWithExactly(target, status)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetNextCaller')
  })
})
