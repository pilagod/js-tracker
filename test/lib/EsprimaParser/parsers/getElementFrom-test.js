describe('getElementFrom tests', () => {
  const callee = {
    parent: 'parent'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
  })

  it('should call isStyleOrDOMTokenList with callee', () => {
    esprimaParser.getElementFrom(callee)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(callee)
    ).to.be.true
  })

  it('should return parent of callee given isStyleOrDOMTokenList return true', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.getElementFrom(callee)

    expect(result).to.be.equal(callee.parent)
  })

  it('should return callee given isStyleOrDOMTokenList return false', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)

    const result = esprimaParser.getElementFrom(callee)

    expect(result).to.be.equal(callee)
  })
})
