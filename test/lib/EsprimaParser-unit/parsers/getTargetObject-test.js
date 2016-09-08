describe('getTargetObject tests', () => {
  const caller = {
    parent: 'parent',
    ownerElement: 'ownerElement'
  }
  const callee = {
    arguments: ['arg1', 'arg2', 'arg3']
  }
  const target = {caller, callee}
  let status

  beforeEach(() => {
    status = {}

    sandbox.stub(esprimaParser, 'isStyleOrDOMTokenList')
    sandbox.stub(esprimaParser, 'isAttr')
  })

  it('should return status.passive given status has property passive', () => {
    status.passive = {}

    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(status.passive)
  })

  it('should call isStyleOrDOMTokenList with caller given status has no passive property', () => {
    esprimaParser.getTargetObject(target, status)

    expect(
      esprimaParser.isStyleOrDOMTokenList
        .calledWithExactly(caller)
    ).to.be.true
  })

  it('should return parent of caller given isStyleOrDOMTokenList returns true', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(true)

    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(caller.parent)
  })

  it('should call isAttr with caller given isStyleOrDOMTokenList returns false', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)

    esprimaParser.getTargetObject(target, status)

    expect(
      esprimaParser.isAttr
        .calledWithExactly(caller)
    ).to.be.true
  })

  it('should return ownerElement of caller given isAttr returns true', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)
    esprimaParser.isAttr.returns(true)

    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(caller.ownerElement)
  })

  it('should return caller given isStyleOrDOMTokenList and isAttr both return false', () => {
    esprimaParser.isStyleOrDOMTokenList.returns(false)
    esprimaParser.isAttr.returns(false)

    const result = esprimaParser.getTargetObject(target, status)

    expect(result).to.be.equal(caller)
  })
})
