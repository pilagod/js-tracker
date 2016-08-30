describe('createPropDispatcher tests', () => {
  let Dispatcher, createPropDispatcher, info, propDispatcher

  before(() => {
    Dispatcher = require(`${libDir}/structures/Dispatcher`)
    createPropDispatcher = require(`${libDir}/dispatchers/createPropDispatcher`)

    info = {
      path: `${__dirname}/${libDir}/dispatchers`,
      options: {dir: false}
    }
    propDispatcher = createPropDispatcher(info)
  })

  it('should return a Dispatcher instance', () => {
    expect(propDispatcher).to.be.instanceof(Dispatcher)
  })

  it('should import all handlers to Dispatcher from given path and options', () => {
    const handlers = importAllFrom(info.path, info.options)

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
