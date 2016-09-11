describe('getTargetElements tests', () => {
  const caller = {}
  const status = {}
  // stub results
  let object
  const elements = ['element1', 'element2', 'element3']

  beforeEach(() => {
    object = {}

    sandbox.stub(esprimaParser, 'getTargetObject').returns(object)
    sandbox.stub(esprimaParser, 'isJquery')
  })

  it('should call getTargetObject with caller and status', () => {
    esprimaParser.getTargetElements(caller, status)

    expect(
      esprimaParser.getTargetObject
        .calledWithExactly(caller, status)
    ).to.be.true
  })

  it('should call isJquery with object from getTargetObject', () => {
    esprimaParser.getTargetElements(caller, status)

    expect(
      esprimaParser.isJquery
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should return object.get() given isJquery returns true', () => {
    esprimaParser.isJquery.returns(true)
    object.get = sandbox.stub().returns(elements)

    const result = esprimaParser.getTargetElements(caller, status)

    expect(result).to.be.eql(elements)
  })

  it('should return an array concated with object given isJquery returns false', () => {
    esprimaParser.isJquery.returns(false)
    esprimaParser.getTargetObject.returns(elements)

    const result = esprimaParser.getTargetElements(caller, status)

    expect(result).to.be.eql(elements)
  })
})
