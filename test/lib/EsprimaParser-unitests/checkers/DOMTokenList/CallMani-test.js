const proxyquire = require('proxyquire')

describe('callManiChecker tests', () => {
  const criteria = {}
  const callee = 'callee'
  const statusData = {execute: undefined}
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/DOMTokenList/Call/mani`, {
      './criteria': criteria,
      '../../../helpers/callManiChecker': checkerStub
    })
  })

  it('should call callManiChecker with an object containing proper criteria, callee and statusData then return', () => {
    const result = checker({callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee, statusData})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
