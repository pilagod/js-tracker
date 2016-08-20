describe('isStyle tests', () => {
  const CSSStyleDeclarationStub = class {}
  const contextStub = {
    CSSStyleDeclaration: CSSStyleDeclarationStub
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', contextStub)
  })

  it('should return true given object is instance of context\'s CSSStyleDeclaration', () => {
    const object = new CSSStyleDeclarationStub()

    const result = esprimaParser.isStyle(object)

    expect(result).to.be.true
  })

  it('should return false given object is not instance of context\'s CSSStyleDeclaration', () => {
    const object = new (class {})

    const result = esprimaParser.isStyle(object)

    expect(result).to.be.false
  })
})
