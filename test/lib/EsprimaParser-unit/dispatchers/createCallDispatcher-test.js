describe('createCallDispatcher tests', () => {
  let Callee, Dispatcher, createCallDispatcher, info, callDispatcher

  before(() => {
    Callee = require(`${libDir}/structures/Callee`)
    Dispatcher = require(`${libDir}/structures/Dispatcher`)
    createCallDispatcher = require(`${libDir}/dispatchers/createCallDispatcher`)

    info = {
      path: `${__dirname}/${libDir}/dispatchers`,
      options: {dir: false}
    }
    callDispatcher = createCallDispatcher(info)
  })

  it('should return a Dispatcher instance', () => {
    expect(callDispatcher).to.be.instanceof(Dispatcher)
  })

  it('should import all handlers to Dispatcher from given path and options', () => {
    const handlers = importAllFrom(info.path, info.options)

    expect(callDispatcher.handlers).to.be.eql(handlers)
  })

  it('should return true when test called with data whose callee is instanceof Callee', () => {
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
