describe('getTargetObject tests', () => {
  const caller = {
    parent: 'parent',
    ownerElement: 'ownerElement'
  }
  let status

  beforeEach(() => {
    status = {}

    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
    sandbox.stub(esprimaParser, 'isAttr')
  })

  it('should return status.target given status has property target', () => {
    status.target = {}

    const result = esprimaParser.getTargetObject(caller, status)

    expect(result).to.be.equal(status.target)
  })

  it('should call isStyleOrDOMTokenList with caller given status has no passive property', () => {
    esprimaParser.getTargetObject(caller, status)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(caller)
    ).to.be.true
  })

  it('should return parent of caller given isStyleOrDOMTokenList returns true', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.getTargetObject(caller, status)

    expect(result).to.be.equal(caller.parent)
  })

  it('should call isAttr with caller given isStyleOrDOMTokenList returns false', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)

    esprimaParser.getTargetObject(caller, status)

    expect(
      esprimaParser.isAttr
        .calledWithExactly(caller)
    ).to.be.true
  })

  it('should return ownerElement of caller given isAttr returns true', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)
    esprimaParser.isAttr.returns(true)

    const result = esprimaParser.getTargetObject(caller, status)

    expect(result).to.be.equal(caller.ownerElement)
  })

  it('should return caller given isStyleOrDOMTokenList and isAttr both return false', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)
    esprimaParser.isAttr.returns(false)

    const result = esprimaParser.getTargetObject(caller, status)

    expect(result).to.be.equal(caller)
  })
})
