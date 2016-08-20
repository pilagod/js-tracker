describe('getAfftectedObject tests', () => {
  const callee = {
    parent: 'parent'
  }
  const expression = {
    arguments: ['arg1', 'arg2', 'arg3']
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
  })

  it('should return index status.passive of expression.arguments given status has property passive', () => {
    const status = {
      passive: 1
    }
    const result = esprimaParser.getAfftectedObject(callee, expression, status)

    expect(result).to.be.equal(expression.arguments[status.passive])
  })

  it('should call isStyleOrDOMTokenList with callee given status has no passive property', () => {
    const status = {}

    esprimaParser.getAfftectedObject(callee, expression, status)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(callee)
    ).to.be.true
  })

  it('should return parent of callee given isStyleOrDOMTokenList returns true', () => {
    const status = {}

    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.getAfftectedObject(callee, expression, status)

    expect(result).to.be.equal(callee.parent)
  })

  it('should return callee given isStyleOrDOMTokenList returns false', () => {
    const status = {}

    esprimaParser.isStyleOrDOMTokenList.returns(false)

    const result = esprimaParser.getAfftectedObject(callee, expression, status)

    expect(result).to.be.equal(callee)
  })
})
