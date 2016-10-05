const proxyquire = require('proxyquire')

describe('callManiArg0 checker tests', () => {
  const criteria = {}
  const caller = {}
  const callee = 'callee'
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/call/maniArg0`, {
      './criteria': criteria,
      '../../../helpers/callManiArg0Checker': checkerStub
    })
  })

  it('should call callManiArg0Checker with an object containing proper criteria, callee and statusData (execute -> caller) then return', () => {
    const result = checker({caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
