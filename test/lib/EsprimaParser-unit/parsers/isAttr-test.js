describe.only('isAttr tests', () => {
  const AttrStub = class {}
  const contextStub = {
    Attr: AttrStub
  }
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', contextStub)
  })

  it('should return true given object is instance of context\'s Attr', () => {
    const object = new AttrStub()

    const result = esprimaParser.isAttr(object)

    expect(result).to.be.true
  })

  it('should return false given object is not instance of context\'s Attr', () => {
    const object = new (class {})

    const result = esprimaParser.isAttr(object)

    expect(result).to.be.false
  })
})
