describe('isDOMTokenList test', () => {
  const DOMTokenListStub = class {}
  const contextStub = {
    DOMTokenList: DOMTokenListStub
  }

  it('should return true given executedData is instance of DOMTokenList', () => {
    const executedData = new DOMTokenListStub()

    const result = esprimaParser.isDOMTokenList(contextStub, executedData)

    expect(result).to.be.true
  })

  it('should return true given executedData is instance of DOMTokenList', () => {
    const executedData = new (class {})

    const result = esprimaParser.isDOMTokenList(contextStub, executedData)

    expect(result).to.be.false
  })
})
