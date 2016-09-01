const proxyquire = require('proxyquire')

describe('propEvent checker tests', () => {
  const criteria = {}
  const callee = 'callee'
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/HTMLElement/Prop/event`, {
      './criteria': criteria,
      '../../../helpers/propEventChecker': checkerStub
    })
  })

  it('should call propEventChecker with an object containing proper criteria, callee then return', () => {
    const result = checker({callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
