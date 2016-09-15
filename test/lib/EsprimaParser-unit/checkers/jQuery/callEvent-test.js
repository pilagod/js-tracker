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
    checker = proxyquire(`../${libDir}/checkers/jQuery/Call/event`, {
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

  describe.skip('given valid status', () => {
    const divChildrenOfCaller = 'divChildrenOfCaller'

    beforeEach(() => {
      checkerStub.returns(status)
      caller.find = sandbox.stub()
        .withArgs('div')
          .returns(divChildrenOfCaller)
      delete callee.method
      delete callee.arguments
    })

    it('should return status with target set to caller.find called with callee.arguments[1] given callee.method is on, off or one and callee.arguments[1] is string', () => {
      // $().on / one / off ('click', 'div', function () {})
      callee.arguments = ['click', 'div', function () {}]

      for (const method of ['on', 'one', 'off']) {
        callee.method = method

        const result = checker({caller, callee})

        expect(result).to.have.property('type', status.type)
        expect(result).to.have.property('target', divChildrenOfCaller)
      }
    })

    it('should return only status given callee.method is on, off or one but callee.arguments[1] is not string', () => {
      // $().on / one / off ('click', {}, function () {})
      callee.arguments = ['click', {}, function () {}]

      for (const method of ['on', 'one', 'off']) {
        callee.method = method

        const result = checker({caller, callee})

        expect(result).to.eql(status)
      }
    })

    it('should return status with target set to caller.find called with callee.arguments[0] given callee.method is delegate or undelegate and callee.arguments.length > 1', () => {
      // $().delegate / undelegate ('div', 'click', function () {})
      callee.arguments = ['div', 'click', function () {}]

      for (const method of ['delegate', 'undelegate']) {
        callee.method = method

        const result = checker({caller, callee})

        expect(result).to.have.property('type', status.type)
        expect(result).to.have.property('target', divChildrenOfCaller)
      }
    })

    it('should return only status given callee.method is delegate or undelegate but callee.arguments.length < 2', () => {
      // $().undelegate('click')
      callee.arguments = ['click']

      for (const method of ['delegate', 'undelegate']) {
        callee.method = method

        const result = checker({caller, callee})

        expect(result).to.eql(status)
      }
    })
  })
})
