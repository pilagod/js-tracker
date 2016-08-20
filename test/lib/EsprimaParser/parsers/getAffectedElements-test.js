describe('getAffectedElements tests', () => {
  const callee = 'callee'
  const expression = {
    arguments: ['arg1', 'arg2', 'arg3']
  }
  const status = {type: 'STATE'}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getAfftectedObject')
      .returns('resultFromGetAfftectedObject')
    sandbox.stub(esprimaParser, 'getElementsFromAffectedObject')
      .returns('resultFromGetElementsFromAffectedObject')
  })

  it('should call getAfftectedObject with callee, expression and status', () => {
    esprimaParser.getAffectedElements(callee, expression, status)

    expect(
      esprimaParser.getAfftectedObject
        .calledWithExactly(callee, expression, status)
    ).to.be.true
  })

  it('should call getElementsFromAffectedObject with result from getAfftectedObject and return', () => {
    const result = esprimaParser.getAffectedElements(callee, expression, status)

    expect(
      esprimaParser.getElementsFromAffectedObject
        .calledWithExactly('resultFromGetAfftectedObject')
    ).to.be.true
    expect(result).to.be.equal('resultFromGetElementsFromAffectedObject')
  })
})
