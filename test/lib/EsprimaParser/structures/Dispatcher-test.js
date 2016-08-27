describe('Dispatcher tests', () => {
  const importAllFrom = require('import-all-from')

  const libDir = '../../../../lib/EsprimaParser'
  const Dispatcher = require(`${libDir}/structures/Dispatcher`)

  const info = {
    path: `${__dirname}/${libDir}/dispatchers`,
    options: {}
  }
  describe('constructor tests', () => {
    it('should import all modules from given info object (first argument) to property handlers', () => {
      const handlers = importAllFrom(info.path, info.options)
      const dispatcher = new Dispatcher(info)

      expect(dispatcher.handlers).to.be.eql(handlers)
    })

    it('should set test to a function always returns true given no test function passed as second argument', () => {
      const dispatcher = new Dispatcher(info)

      expect(dispatcher.test).to.be.instanceof(Function)

      const result = dispatcher.test()

      expect(result).to.be.true
    })

    it('should set test to the function of given second argument', () => {
      const test = () => false
      const dispatcher = new Dispatcher(info, test)

      expect(dispatcher.test).to.be.equal(test)
    })
  })

  describe('methods tests', () => {
    const data = {}
    const dispatcher = new Dispatcher(info)

    describe('dispatch tests', () => {
      it('should call dispatchDataToHandlers with given data and return given test called with data returns true', () => {
        sandbox.stub(dispatcher, 'test')
          .withArgs(data).returns(true)
        sandbox.stub(dispatcher, 'dispatchDataToHandlers')
          .withArgs(data).returns('resultFromDispatchDataToHandlers')

        const result = dispatcher.dispatch(data)

        expect(
          dispatcher.dispatchDataToHandlers
            .calledWithExactly(data)
        ).to.be.true
        expect(result).to.be.equal('resultFromDispatchDataToHandlers')
      })

      it('should return undefined given test called with data returns false', () => {
        sandbox.stub(dispatcher, 'test')
          .withArgs(data).returns(false)

        const result = dispatcher.dispatch(data)

        expect(result).to.be.undefined
      })
    })

    describe('dispatchDataToHandlers tests', () => {
      let handler

      const getHandlersWithResults = (results) => {
        for (const [index, result] of results.entries()) {
          handler.dispatch.onCall(index).returns(result)
        }
        return new Array(results.length).fill(handler)
      }
      beforeEach(() => {
        handler = {
          dispatch: sandbox.stub()
        }
      })

      it('should call dispatch of each handler in handlers with data and return undefined, given no handlers returns valid result', () => {
        const handlerResults = [undefined, undefined, undefined]
        const handlers = getHandlersWithResults(handlerResults)

        sandbox.stub(dispatcher, 'handlers', handlers)

        const result = dispatcher.dispatchDataToHandlers(data)

        for (const index of handlerResults.keys()) {
          expect(
            handler.dispatch.getCall(index)
              .calledWithExactly(data)
          ).to.be.true
        }
        expect(handler.dispatch.calledThrice).to.be.true
        expect(result).to.be.undefined
      })

      it('should call dispatch of handlers until first one returning valid result and return that result', () => {
        const handlerValidResult = {}
        const handlerResults = [undefined, handlerValidResult, undefined]
        const handlers = getHandlersWithResults(handlerResults)

        sandbox.stub(dispatcher, 'handlers', handlers)

        const result = dispatcher.dispatchDataToHandlers(data)

        for (const index of [0, 1]) {
          expect(
            handler.dispatch.getCall(index)
              .calledWithExactly(data)
          ).to.be.true
        }
        expect(handler.dispatch.calledTwice).to.be.true
        expect(result).to.be.equal(handlerValidResult)
      })
    })
  })
})
