describe('createCallDispatcher tests', () => {
  const handlers = [() => 1, () => 2]
  let createCallDispatcher, callDispatcher

  before(() => {
    createCallDispatcher = require(`${libDir}/dispatchers/createCallDispatcher`)
    callDispatcher = createCallDispatcher(handlers)
  })

  it('should return a Dispatcher instance', () => {
    const Dispatcher = require(`${libDir}/structures/Dispatcher`)

    expect(callDispatcher).to.be.instanceof(Dispatcher)
  })

  it('should set callDispatcher handlers to given handlers', () => {
    expect(callDispatcher.handlers).to.be.equal(handlers)
  })

  it('should return true when test called with data whose callee is instanceof Callee', () => {
    const Callee = require(`${libDir}/structures/Callee`)
    const data = {
      callee: new Callee('method')
    }
    const result = callDispatcher.test(data)

    expect(result).to.be.true
  })

  it('should return true when test called with data whose callee is not instanceof Callee', () => {
    const data = {
      callee: {}
    }
    const result = callDispatcher.test(data)

    expect(result).to.be.false
  })
})
