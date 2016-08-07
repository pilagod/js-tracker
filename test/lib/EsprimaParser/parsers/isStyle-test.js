describe('isStyle tests', () => {
  const CSSStyleDeclarationStub = class {}
  const context = {
    CSSStyleDeclaration: CSSStyleDeclarationStub
  }

  it('should return true given executedData is instance of context\'s CSSStyleDeclaration', () => {
    const executedData = new CSSStyleDeclarationStub()

    const result = esprimaParser.isStyle(context, executedData)

    expect(result).to.be.true
  })

  it('should return false given executedData is not instance of context\'s CSSStyleDeclaration', () => {
    const executedData = new (class {})

    const result = esprimaParser.isStyle(context, executedData)

    expect(result).to.be.false
  })
})
