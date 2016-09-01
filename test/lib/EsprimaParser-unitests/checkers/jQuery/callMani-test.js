const proxyquire = require('proxyquire')

describe('callMani checker tests', () => {
  const criteria = {}
  const caller = {}
  const callee = 'callee'
  const statusData = {execute: caller}
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/mani`, {
      './criteria': criteria,
      '../../../helpers/callManiChecker': checkerStub
    })
  })

  it('should call callManiChecker with an object containing proper criteria, callee and statusData (execute -> caller) then return', () => {
    const result = checker({caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee, statusData})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
