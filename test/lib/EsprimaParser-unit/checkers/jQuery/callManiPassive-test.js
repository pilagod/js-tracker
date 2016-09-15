const proxyquire = require('proxyquire')

describe('callManiPassive checker tests', () => {
  const criteria = {}
  const context = {}
  const caller = {}
  const callee = {
    method: 'callee',
    arguments: ['argument']
  }
  const status = {
    type: 'type'
  }
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub()
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/maniPassive`, {
      './criteria': criteria,
      '../../../helpers/callManiChecker': checkerStub
    })
  })

  it('should call callManiPassiveChecker with an object containing criteria and callee', () => {
    checker({context, caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee})
    ).to.be.true
  })

  it('should set target in result status to jQuery called with callee.arguments[0] given callManiPassiveChecker returns valid status', () => {
    const $target = {}

    checkerStub.returns(status)
    context.jQuery = sandbox.stub()
      .withArgs(callee.arguments[0])
        .returns($target)

    const result = checker({context, caller, callee})

    expect(result).to.have.property('type', status.type)
    expect(result).to.have.property('target', $target)
  })

  it('should return undefined given callManiPassiveChecker returns undefined status', () => {
    checkerStub.returns(undefined)

    const result = checker({context, caller, callee})

    expect(result).to.be.undefined
  })
})
