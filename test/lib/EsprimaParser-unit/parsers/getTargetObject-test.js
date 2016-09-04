describe('getTargetObject tests', () => {
  const caller = {
    parent: 'parent'
  }
  const callee = {
    arguments: ['arg1', 'arg2', 'arg3']
  }
  const target = {caller, callee}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
  })

  it('should return index status.passive of expression.arguments given status has property passive', () => {
    const status = {
      passive: 1
    }
    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(callee.arguments[status.passive])
  })

  it('should call isStyleOrDOMTokenList with caller given status has no passive property', () => {
    const status = {}

    esprimaParser.getTargetObject(target, status)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(caller)
    ).to.be.true
  })

  it('should return parent of caller given isStyleOrDOMTokenList returns true', () => {
    const status = {}

    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(caller.parent)
  })

  it('should return caller given isStyleOrDOMTokenList returns false', () => {
    const status = {}

    esprimaParser.isStyleOrDOMTokenList.returns(false)

    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(caller)
  })
})
