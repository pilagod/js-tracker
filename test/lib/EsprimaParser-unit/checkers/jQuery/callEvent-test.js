const proxyquire = require('proxyquire')

describe('callEvent checker tests', () => {
  const criteria = {}
  const caller = {}
  const callee = {}
  const status = {
    type: 'type'
  }
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub()
    checker = proxyquire(`../${libDir}/checkers/jQuery/call/event`, {
      './criteria': criteria,
      '../../../helpers/callEventChecker': checkerStub
    })
  })

  it('should call callEventChecker with an object containing criteria and callee', () => {
    checker({caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
  })

  it('should return undefined given callEventChecker returns undefined status', () => {
    checkerStub.returns(undefined)

    const result = checker({caller, callee})

    expect(result).to.be.undefined
  })

  it('should return status from callEventChecker given callee.method is not on, off, one, delegate, undelegate', () => {
    callee.method = 'event'
    checkerStub.returns(status)

    const result = checker({caller, callee})

    expect(result).to.be.eql(status)
  })
})
