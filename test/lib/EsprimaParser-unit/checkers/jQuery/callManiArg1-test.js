const proxyquire = require('proxyquire')

describe('callManiArg1 checker tests', () => {
  const criteria = {}
  const caller = {}
  const callee = 'callee'
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/call/maniArg1`, {
      './criteria': criteria,
      '../../../helpers/callManiArg1Checker': checkerStub
    })
  })

  it('should call callManiArg1Checker with an object containing proper criteria, callee and statusData (execute -> caller) then return', () => {
    const result = checker({caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
