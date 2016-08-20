describe('isStyleOrDOMTokenList tests', () => {
  const object = 'object'
  const contextStub = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isStyle')
    sandbox.stub(esprimaParser, 'isDOMTokenList')
  })

  it('should call isStyle with object', () => {
    esprimaParser.isStyleOrDOMTokenList(object)

    expect(
      esprimaParser.isStyle
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should call isDOMTokenList with object given isStyle returns false', () => {
    esprimaParser.isStyle.returns(false)

    esprimaParser.isStyleOrDOMTokenList(object)

    expect(
      esprimaParser.isDOMTokenList
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should not call isDOMTokenList given isStyle returns true', () => {
    esprimaParser.isStyle.returns(true)

    esprimaParser.isStyleOrDOMTokenList(object)

    expect(esprimaParser.isDOMTokenList.called).to.be.false
  })

  it('should return true given isStyle returns true', () => {
    esprimaParser.isStyle.returns(true)

    const result = esprimaParser.isStyleOrDOMTokenList(object)

    expect(result).to.be.true
  })

  it('should return true given isStyle returns false and isDOMTokenList returns true', () => {
    esprimaParser.isStyle.returns(false)
    esprimaParser.isDOMTokenList.returns(true)

    const result = esprimaParser.isStyleOrDOMTokenList(object)

    expect(result).to.be.true
  })

  it('should return false given isStyle and isDOMTokenList both return false', () => {
    esprimaParser.isStyle.returns(false)
    esprimaParser.isDOMTokenList.returns(false)

    const result = esprimaParser.isStyleOrDOMTokenList(object)

    expect(result).to.be.false
  })
})
