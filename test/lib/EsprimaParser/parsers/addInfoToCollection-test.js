describe('addInfoToCollection tests', () => {
  const info = {}
  const caller = 'caller'
  const callee = 'callee'
  const status = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getAffectedElements')
      .returns('resultFromGetAffectedElements')
    sandbox.stub(esprimaParser, 'addInfoToElements')
  })

  it('should call getAffectedElements with caller, callee, and status', () => {
    esprimaParser.addInfoToCollection(caller, callee, info, status)

    expect(
      esprimaParser.getAffectedElements
        .calledWithExactly(caller, callee, status)
    ).to.be.true
  })

  it('should call addInfoToElements with result from getAffectedElements, info and status', () => {
    esprimaParser.addInfoToCollection(caller, callee, info, status)

    expect(
      esprimaParser.addInfoToElements
        .calledWithExactly('resultFromGetAffectedElements', info, status)
    ).to.be.true
  })
})
