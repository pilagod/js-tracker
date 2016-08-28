describe('Dispatcher tests', () => {
  const importAllFrom = require('import-all-from')
  let Dispatcher, info

  before(() => {
    Dispatcher = require(`${libDir}/structures/Dispatcher`)

    info = {
      path: `${__dirname}/${libDir}/dispatchers`,
      options: {}
    }
  })

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
    let dispatcher

    before(() => {
      dispatcher = new Dispatcher(info)
    })

    describe('dispatch tests', () => {
      it('should call dispatchToHandlers with given data and return given test called with data returns true', () => {
        sandbox.stub(dispatcher, 'test')
          .withArgs(data).returns(true)
        sandbox.stub(dispatcher, 'dispatchToHandlers')
          .withArgs(data).returns('resultFromDispatchToHandlers')

        const result = dispatcher.dispatch(data)

        expect(
          dispatcher.dispatchToHandlers
            .calledWithExactly(data)
        ).to.be.true
        expect(result).to.be.equal('resultFromDispatchToHandlers')
      })

      it('should return undefined given test called with data returns false', () => {
        sandbox.stub(dispatcher, 'test')
          .withArgs(data).returns(false)

        const result = dispatcher.dispatch(data)

        expect(result).to.be.undefined
      })
    })

    describe('dispatchToHandlers tests', () => {
      const handlers = [() => 1, () => 2, () => 3]
      const setInvokeResults = (values) => {
        for (const [index, value] of values.entries()) {
          dispatcher.invoke.onCall(index).returns(value)
        }
      }
      beforeEach(() => {
        sandbox.stub(dispatcher, 'handlers', handlers)
        sandbox.stub(dispatcher, 'invoke')
      })

      it('should call invoke with each handler and data then return undefined given all results from invoke are undefined', () => {
        setInvokeResults([undefined, undefined, undefined])

        const result = dispatcher.dispatch(data)

        for (const index of [0, 1, 2]) {
          expect(
            dispatcher.invoke.getCall(index)
              .calledWithExactly(handlers[index], data)
          ).to.be.true
        }
        expect(dispatcher.invoke.calledThrice).to.be.true
        expect(result).to.be.undefined
      })

      it('should call invoke until getting first valid result and return it', () => {
        const status = {type: 'TYPE'}

        setInvokeResults([undefined, status, undefined])

        const result = dispatcher.dispatch(data)

        for (const index of [0, 1]) {
          expect(
            dispatcher.invoke.getCall(index)
              .calledWithExactly(handlers[index], data)
          ).to.be.true
        }
        expect(dispatcher.invoke.calledTwice).to.be.true
        expect(result).to.be.equal(status)
      })
    })

    describe('invoke tests',() => {
      it('should call dispatch of handler with data and return given handler has dispatch property', () => {
        const handler = {
          dispatch: sandbox.stub()
            .withArgs(data).returns('resultFromDispatch')
        }
        const result = dispatcher.invoke(handler, data)

        expect(
          handler.dispatch
            .calledWithExactly(data)
        ).to.be.true
        expect(result).to.be.equal('resultFromDispatch')
      })

      it('should call handler with data and return given handler has no dispatch property', () => {
        const handler = sandbox.stub()
          .withArgs(data).returns('resultFromHandler')

        const result = dispatcher.invoke(handler, data)

        expect(
          handler
            .calledWithExactly(data)
        ).to.be.true
        expect(result).to.be.equal('resultFromHandler')
      })
    })
  })
})
