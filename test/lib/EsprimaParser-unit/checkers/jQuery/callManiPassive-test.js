const proxyquire = require('proxyquire')

describe('callManiPassive checker tests', () => {
  const criteria = {}
  const context = {}
  const caller = {}
  const callee = {
    method: 'callee',
    arguments: ['argument']
  }
  let checkerStub, checker

  before(() => {
    checkerStub = sandbox.stub().returns('resultFromChecker')
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/maniPassive`, {
      './criteria': criteria,
      '../../../helpers/callManiChecker': checkerStub
    })
  })

  it('should call callManiPassiveChecker with an object containing proper criteria, callee and statusData (execute -> caller, passive -> jQuery(callee.argument[0])) then return', () => {
    const $element = [callee.arguments[0]]
    const statusData = {
      passive: $element
    }
    context.jQuery = sandbox.stub()
      .withArgs(callee.arguments[0])
        .returns($element)

    const result = checker({context, caller, callee})

    expect(checkerStub.calledOnce).to.be.true
    expect(
      context.jQuery
        .calledWithExactly(callee.arguments[0])
    ).to.be.true
    expect(
      checkerStub
        .calledWithExactly({criteria, callee, statusData})
    ).to.be.true
    expect(result).to.be.eql('resultFromChecker')
  })
})
