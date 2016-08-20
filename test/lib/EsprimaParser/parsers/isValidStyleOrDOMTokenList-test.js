describe('isValidStyleOrDOMTokenList tests', () => {
  const object = 'object'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'hasNoParent')
    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
  })

  it('should call hasNoParent with object', () => {
    esprimaParser.isValidStyleOrDOMTokenList(object)

    expect(
      esprimaParser.hasNoParent
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should call isStyleOrDOMTokenList with object given hasNoParent returns true', () => {
    esprimaParser.hasNoParent.returns(true)

    esprimaParser.isValidStyleOrDOMTokenList(object)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should return true given hasNoParent and isStyleOrDOMTokenList both return true', () => {
    esprimaParser.hasNoParent.returns(true)
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.isValidStyleOrDOMTokenList(object)

    expect(result).to.be.true
  })

  it('should return false given hasNoParent returns false', () => {
    esprimaParser.hasNoParent.returns(false)
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.isValidStyleOrDOMTokenList(object)

    expect(result).to.be.false
  })

  it('should return false given isStyleOrDOMTokenList returns false', () => {
    esprimaParser.hasNoParent.returns(true)
    esprimaParser.isStyleOrDOMTokenList.returns(false)

    const result = esprimaParser.isValidStyleOrDOMTokenList(object)

    expect(result).to.be.false
  })
})
