const proxyquire = require('proxyquire')

describe('callEventArg1 checker tests', () => {
  const criteria = {}
  const callee = 'callee'
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/eventArgge1`, {
      './criteria': criteria,
      '../../../helpers/callEventArgge1Checker': checkerStub
    })
  })

  it('should call callEventArgge1Checker with an object containing proper criteria and callee then return', () => {
    const result = checker({callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
