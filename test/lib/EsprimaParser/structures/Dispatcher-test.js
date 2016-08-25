describe('Dispatcher tests', () => {
  const importAllFrom = require('import-all-from')
  const libDir = '../../../../lib/EsprimaParser'
  const checkerDir = `${__dirname}/${libDir}/checkers`
  const Dispatcher = require(`${libDir}/structures/Dispatcher`)

  describe('constructor tests', () => {
    it('should import all checkers under given dir path to checkers', () => {
      const dispatcher = new Dispatcher(checkerDir)
      const checkers = importAllFrom(checkerDir)

      expect(dispatcher.checkers).to.be.eql(checkers)
    })

    it('should import checkers by given importing options', () => {
      const options = {
        dir: false
      }
      const dispatcher = new Dispatcher(checkerDir, options)
      const checkers = importAllFrom(checkerDir, options)

      expect(dispatcher.checkers).to.be.eql(checkers)
    })
  })

  describe('methods tests', () => {
    let checkerDispatcher

    beforeEach(() => {
      checkerDispatcher = new Dispatcher(checkerDir)
    })

    describe('dispatch tests', () => {
      let checker

      const data = {}
      const getCheckers = (statuses) => {
        for (const [index, status] of statuses.entries()) {
          checker.dispatch.onCall(index).returns(status)
        }
        return new Array(statuses.length).fill(checker)
      }

      beforeEach(() => {
        checker = {
          dispatch: sandbox.stub()
        }
      })

      it('should call dispatch of each checker in checkers with data and return undefined given no valid status', () => {
        const statuses = [undefined, undefined, undefined]
        const checkers = getCheckers(statuses)

        sandbox.stub(checkerDispatcher, 'checkers', checkers)

        const result = checkerDispatcher.dispatch(data)

        for (const index of statuses.keys()) {
          expect(
            checker.dispatch.getCall(index)
              .calledWithExactly(data)
          ).to.be.true
        }
        expect(checker.dispatch.calledThrice).to.be.true
        expect(result).to.be.undefined
      })

      it('should call checkers until getting first valid status and return', () => {
        const status = {
          type: 'EVENT',
          execute: 'execute',
          passive: 'passive'
        }
        const statuses = [undefined, status, undefined]
        const checkers = getCheckers(statuses)

        sandbox.stub(checkerDispatcher, 'checkers', checkers)

        const result = checkerDispatcher.dispatch(data)

        expect(
          checker.dispatch.firstCall
            .calledWithExactly(data)
        ).to.be.true
        expect(
          checker.dispatch.secondCall
            .calledWithExactly(data)
        ).to.be.true
        expect(checker.dispatch.calledTwice).to.be.true
        expect(result).to.be.equal(status)
      })
    })
  })
})
