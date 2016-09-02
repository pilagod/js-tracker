describe('getElementsFromAffectedObject tests', () => {
  let object

  beforeEach(() => {
    object = {
      get: sandbox.stub().returns('resultFromGetOfJqueryObject')
    }
    sandbox.stub(esprimaParser, 'isJquery')
  })

  it('should call isJquery with object', () => {
    esprimaParser.getElementsFromAffectedObject(object)

    expect(
      esprimaParser.isJquery
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should return get of object given isJquery called with object returns true', () => {
    esprimaParser.isJquery.withArgs(object).returns(true)

    const result = esprimaParser.getElementsFromAffectedObject(object)

    expect(result).to.be.equal('resultFromGetOfJqueryObject')
  })

  it('should return an array containing object given isJquery called with object returns false', () => {
    esprimaParser.isJquery.withArgs(object).returns(false)

    const result = esprimaParser.getElementsFromAffectedObject(object)

    expect(result).to.be.eql([object])
  })
})
