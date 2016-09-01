const proxyquire = require('proxyquire')

describe('callManiPassive checker tests', () => {
  const criteria = {}
  const caller = {}
  const callee = {
    method: 'callee',
    arguments: ['argument']
  }
  const statusData = {
    execute: caller,
    passive: callee.arguments[0]
  }
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/maniPassive`, {
      './criteria': criteria,
      '../../../helpers/callManiChecker': checkerStub
    })
  })

  it('should call callManiPassiveChecker with an object containing proper criteria, callee and statusData (execute -> caller, passive -> callee.argument[0]) then return', () => {
    const result = checker({caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee, statusData})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
