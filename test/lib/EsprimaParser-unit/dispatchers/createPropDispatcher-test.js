describe('createPropDispatcher tests', () => {
  const handlers = [() => 1, () => 2]
  let createPropDispatcher, info, propDispatcher

  before(() => {
    createPropDispatcher = require(`${libDir}/dispatchers/createPropDispatcher`)
    propDispatcher = createPropDispatcher(handlers)
  })

  it('should return a Dispatcher instance', () => {
    const Dispatcher = require(`${libDir}/structures/Dispatcher`)

    expect(propDispatcher).to.be.instanceof(Dispatcher)
  })

  it('should set propDispatcher handlers to given handlers', () => {
    expect(propDispatcher.handlers).to.be.eql(handlers)
  })

  it('should return true when test called with data whose callee is typeof string', () => {
    const data = {
      callee: 'prop'
    }
    const result = propDispatcher.test(data)

    expect(result).to.be.true
  })

  it('should return true when test called with data whose callee is not typeof string', () => {
    const data = {
      callee: {}
    }
    const result = propDispatcher.test(data)

    expect(result).to.be.false
  })
})
