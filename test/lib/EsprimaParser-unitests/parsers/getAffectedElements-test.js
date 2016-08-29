describe('getAffectedElements tests', () => {
  const caller = 'caller'
  const callee = {
    arguments: ['arg1', 'arg2', 'arg3']
  }
  const status = {type: 'STATE'}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getAfftectedObject')
      .returns('resultFromGetAfftectedObject')
    sandbox.stub(esprimaParser, 'getElementsFromAffectedObject')
      .returns('resultFromGetElementsFromAffectedObject')
  })

  it('should call getAfftectedObject with caller, callee and status', () => {
    esprimaParser.getAffectedElements(caller, callee, status)

    expect(
      esprimaParser.getAfftectedObject
        .calledWithExactly(caller, callee, status)
    ).to.be.true
  })

  it('should call getElementsFromAffectedObject with result from getAfftectedObject and return', () => {
    const result = esprimaParser.getAffectedElements(caller, callee, status)

    expect(
      esprimaParser.getElementsFromAffectedObject
        .calledWithExactly('resultFromGetAfftectedObject')
    ).to.be.true
    expect(result).to.be.equal('resultFromGetElementsFromAffectedObject')
  })
})
