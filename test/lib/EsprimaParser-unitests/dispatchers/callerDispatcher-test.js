const importAllFrom = require('import-all-from')

for (const DISPATCHER of global.DISPATCHERS) {
  const type = DISPATCHER.type

  describe(`${type} dispatcher tests`, () => {
    let callerDispatcher, workDir

    before(() => {
      workDir = `${libDir}/dispatchers/${type}Dispatcher`
      callerDispatcher = require(workDir)
    })

    it(`should import all other handlers in /${type}Dispatcher`, () => {
      const path = `${__dirname}/${workDir}`
      const handlers = importAllFrom(path, {file: false})

      expect(callerDispatcher.handlers).to.be.eql(handlers)
    })

    it(`should return false when test called with data whose context has no ${type}`, () => {
      const data = {
        context: {}
      }
      const result = callerDispatcher.test(data)

      expect(result).to.be.false
    })

    it(`should return false when test called with data whose context has ${type} but caller is not instanceof context.${type}`, () => {
      const CallerType = function () {}
      const data = {
        context: {
          [type]: CallerType
        },
        caller: {}
      }
      const result = callerDispatcher.test(data)

      expect(result).to.be.false
    })

    it(`should return true when test called with data whose context has ${type} and caller is instanceof context.${type}`, () => {
      const CallerType = function () {}
      const data = {
        context: {
          [type]: CallerType
        },
        caller: new CallerType()
      }
      const result = callerDispatcher.test(data)

      expect(result).to.be.true
    })
  })
}
