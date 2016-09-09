describe('executeCall tests', () => {
  const caller = {}
  const callee = {
    arguments: ['arg1', 'arg2']
  }
  // stub results
  const resultFromApply = 'resultFromApply'
  let calledMethodStub

  beforeEach(() => {
    calledMethodStub = {
      apply: sandbox.stub().returns(resultFromApply)
    }
    sandbox.stub(esprimaParser, 'getCalledMethod')
      .returns(calledMethodStub)
  })

  it('should call getCalledMethod with an object containing caller and callee', () => {
    esprimaParser.executeCall({caller, callee})

    expect(
      esprimaParser.getCalledMethod
        .calledWithExactly({caller, callee})
    ).to.be.true
  })

  it('should call apply from result of getCalledMethod with caller and callee.arguments then return', () => {
    const result = esprimaParser.executeCall({caller, callee})

    expect(
      calledMethodStub.apply
        .calledWithExactly(caller, callee.arguments)
    ).to.be.true
    expect(result).to.be.equal(resultFromApply)
  })
})
