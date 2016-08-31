const proxyquire = require('proxyquire')

describe('callEventChecker tests', () => {
  const criteria = {}
  const callee = 'callee'
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/HTMLElement/Call/event`, {
      './criteria': criteria,
      '../../../helpers/callEventChecker': checkerStub
    })
  })

  it('should call callEventChecker with an object containing proper criteria and callee then return', () => {
    const result = checker({callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
