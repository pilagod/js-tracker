describe('isDOMTokenList test', () => {
  const DOMTokenListStub = class {}
  const contextStub = {
    DOMTokenList: DOMTokenListStub
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', contextStub)
  })

  it('should return true given object is instance of DOMTokenList', () => {
    const object = new DOMTokenListStub()

    const result = esprimaParser.isDOMTokenList(object)

    expect(result).to.be.true
  })

  it('should return true given object is instance of DOMTokenList', () => {
    const object = new (class {})

    const result = esprimaParser.isDOMTokenList(object)

    expect(result).to.be.false
  })
})
