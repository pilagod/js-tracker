describe('Dispatcher tests', () => {
  let Dispatcher

  before(() => {
    Dispatcher = require(`${libDir}/structures/Dispatcher`)
  })

  describe('constructor tests', () => {
    it('should set handlers to first given argument', () => {
      const handlers = [() => 1, () => 2]
      const dispatcher = new Dispatcher(handlers)

      expect(dispatcher.handlers).to.be.equal(handlers)
    })

    it('should set handlers to empty array by default', () => {
      const dispatcher = new Dispatcher()

      expect(dispatcher.handlers).to.be.eql([])
    })

    it('should set test to the function of second given argument', () => {
      const test = () => false
      const dispatcher = new Dispatcher([], test)

      expect(dispatcher.test).to.be.equal(test)
    })

    it('should set test to a function always returns true by default', () => {
      const dispatcher = new Dispatcher()

      expect(dispatcher.test).to.be.a('function')

      const result = dispatcher.test()

      expect(result).to.be.true
    })
  })

  describe('methods tests', () => {
    const data = {}
    let dispatcher

    before(() => {
      dispatcher = new Dispatcher()
    })

    describe('dispatch tests', () => {
      it('should call dispatchToHandlers with data and return when test called with data returns true', () => {
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

      it('should return undefined when test called with data returns false', () => {
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
