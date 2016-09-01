const proxyquire = require('proxyquire')

describe('callEventArg1 checker tests', () => {
  const criteria = {}
  const callee = 'callee'
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/eventArg1`, {
      './criteria': criteria,
      '../../../helpers/callEventArg1Checker': checkerStub
    })
  })

  it('should call callEventArg1Checker with an object containing proper criteria and callee then return', () => {
    const result = checker({callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
