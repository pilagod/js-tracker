describe('executeCall tests', () => {
  const pre = 'pre'
  const cur = {
    arguments: ['arg1', 'arg2', 'arg3']
  }
  let methodStub

  beforeEach(() => {
    methodStub = {
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

  it('should call apply of result from getMethod with pre and cur.arguments then return', () => {
    const result = esprimaParser.executeCall(pre, cur)

    expect(
      methodStub.apply
        .calledWithExactly(pre, cur.arguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromApply')
  })
})
