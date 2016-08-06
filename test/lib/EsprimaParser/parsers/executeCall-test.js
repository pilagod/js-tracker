describe('executeCall tests', () => {
  const pre = 'pre'
  const cur = {
    arguments: 'arguments'
  }
  let methodStub

  beforeEach(() => {
    methodStub = {
      self: 'self',
      apply: sandbox.stub().returns('resultFromApply')
    }

    sandbox.stub(esprimaParser, 'getMethod')
      .returns(methodStub)
  })

  it('should call getMethod with pre and cur', () => {
    esprimaParser.executeCall(pre, cur)

    expect(
      esprimaParser.getMethod
        .calledWithExactly(pre, cur)
    ).to.be.true
  })

  it('should call apply of method got from getMethod with method.self and cur.arguments given valid method.self and return', () => {
    const result = esprimaParser.executeCall(pre, cur)

    expect(
      methodStub.apply
        .calledWithExactly(methodStub.self, cur.arguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromApply')
  })

  it('should call apply of method got from getMethod with pre and cur.arguments given undefined method.self and return', () => {
    methodStub.self = undefined

    const result = esprimaParser.executeCall(pre, cur)

    expect(
      methodStub.apply
        .calledWithExactly(pre, cur.arguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromApply')
  })
})
