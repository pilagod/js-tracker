describe('addInfoToCollection tests', () => {
  const target = {
    caller: {},
    callee: {},
    info: {}
  }
  const status = {}
  // stub results
  const object = {}
  const elements = []

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getTargetObject').returns(object)
    sandbox.stub(esprimaParser, 'getTargetElements').returns(elements)
    sandbox.stub(esprimaParser, 'addInfoByStatus')
  })

  it('should call getTargetObject with target and status', () => {
    esprimaParser.addInfoToCollection(target, status)

    expect(
      esprimaParser.getTargetObject
        .calledWithExactly(target, status)
    ).to.be.true
  })

  it('should call getTargetElements with result from getTargetObject', () => {
    esprimaParser.addInfoToCollection(target, status)

    expect(
      esprimaParser.getTargetElements
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should call addInfoByStatus with {elements, info} and status', () => {
    esprimaParser.addInfoToCollection(target, status)

    expect(
      esprimaParser.addInfoByStatus
        .calledWithExactly({
          elements,
          info: target.info
        }, status)
    ).to.be.true
  })
})
