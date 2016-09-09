describe('parseMemberExp tests', () => {
  const exp = {
    caller: {},
    callee: 'callee'
  }
  // stub results
  let resultFromExecute

  beforeEach(() => {
    resultFromExecute = {}

    sandbox.stub(esprimaParser, 'execute')
      .returns(resultFromExecute)
    sandbox.stub(esprimaParser, 'isValidStyleOrDOMTokenList')
  })

  it('should call execute with exp', () => {
    esprimaParser.parseMemberExp(exp)

    expect(
      esprimaParser.execute
        .calledWithExactly(exp)
    ).to.be.true
  })

  it('should call isValidStyleOrDOMTokenList with result from execute', () => {
    esprimaParser.parseMemberExp(exp)

    expect(
      esprimaParser.isValidStyleOrDOMTokenList
        .calledWithExactly(resultFromExecute)
    ).to.be.true
  })

  it('should set result\'s parent to caller, then return given isValidStyleOrDOMTokenList called with result returns true', () => {
    esprimaParser.isValidStyleOrDOMTokenList
      .withArgs(resultFromExecute)
        .returns(true)

    const result = esprimaParser.parseMemberExp(exp)

    expect(resultFromExecute).to.have.property('parent', exp.caller)
    expect(result).to.be.equal(resultFromExecute)
  })

  it('should not set result\'s parent to caller, then return given isValidStyleOrDOMTokenList called with result returns false', () => {
    esprimaParser.isValidStyleOrDOMTokenList
      .withArgs(resultFromExecute)
        .returns(false)

    const result = esprimaParser.parseMemberExp(exp)

    expect(resultFromExecute).to.not.have.property('parent')
    expect(result).to.be.equal(resultFromExecute)
  })
})
