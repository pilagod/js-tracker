describe('isValidStyleOrDOMTokenList tests', () => {
  const executedData = 'executedData'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'hasNoParent')
    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
  })

  it('should call hasNoParent with executedData', () => {
    esprimaParser.isValidStyleOrDOMTokenList(executedData)

    expect(
      esprimaParser.hasNoParent
        .calledWithExactly(executedData)
    ).to.be.true
  })

  it('should call isStyleOrDOMTokenList with executedData given hasNoParent returns true', () => {
    esprimaParser.hasNoParent.returns(true)

    esprimaParser.isValidStyleOrDOMTokenList(executedData)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(executedData)
    ).to.be.true
  })

  it('should return true given hasNoParent and isStyleOrDOMTokenList both return true', () => {
    esprimaParser.hasNoParent.returns(true)
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.isValidStyleOrDOMTokenList(executedData)

    expect(result).to.be.true
  })

  it('should return false given hasNoParent returns false', () => {
    esprimaParser.hasNoParent.returns(false)
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.isValidStyleOrDOMTokenList(executedData)

    expect(result).to.be.false
  })

  it('should return false given isStyleOrDOMTokenList returns false', () => {
    esprimaParser.hasNoParent.returns(true)
    esprimaParser.isStyleOrDOMTokenList.returns(false)

    const result = esprimaParser.isValidStyleOrDOMTokenList(executedData)

    expect(result).to.be.false
  })
})
