describe('Checker tests', () => {
  const importAllFrom = require('import-all-from')
  const libDir = '../../../../lib/EsprimaParser'
  const checkerDir = `${__dirname}/${libDir}/checkers`
  const Checker = require(`${libDir}/structures/Checker`)

  describe('constructor tests', () => {
    const callback = function () {}

    it('should set property check to given checkCallback', () => {
      const checker = new Checker(callback, checkerDir)

      expect(checker.check).to.be.equal(callback)
    })

    it('should import all checkers under given dir path to checkers', () => {
      const checker = new Checker(callback, checkerDir)
      const checkers = importAllFrom(checkerDir)

      expect(checker.checkers).to.be.eql(checkers)
    })

    it('should import checkers by given importing options', () => {
      const options = {
        dir: false
      }
      const checker = new Checker(callback, checkerDir, options)
      const checkers = importAllFrom(checkerDir, options)

      expect(checker.checkers).to.be.eql(checkers)
    })
  })

  describe('methods tests', () => {
    const data = {}

    let checker, callback

    beforeEach(() => {
      callback = sandbox.stub()
      checker = new Checker(callback, checkerDir)
    })

    describe('dispatch tests', () => {
      beforeEach(() => {
        sandbox.stub(checker, 'getStatus')
          .returns('resultFromGetStatus')
      })

      it('should call check of checker with given data', () => {
        checker.dispatch(data)

        expect(callback.calledWithExactly(data)).to.be.true
      })

      it('should call getStatus with data and return given check of checker returns true', () => {
        callback.returns(true)

        const result = checker.dispatch(data)

        expect(
          checker.getStatus
            .calledWithExactly(data)
        ).to.be.true
        expect(result).to.be.equal('resultFromGetStatus')
      })

      it('should return undefined given check of checker returns false', () => {
        callback.returns(false)

        const result = checker.dispatch(data)

        expect(checker.getStatus.called).to.be.false
        expect(result).to.be.undefined
      })
    })

    describe('getStatus tests', () => {
      let subChecker

      const getCheckers = (statuses) => {
        for (const [index, status] of statuses.entries()) {
          subChecker.onCall(index).returns(status)
        }
        return new Array(statuses.length).fill(subChecker)
      }

      beforeEach(() => {
        subChecker = sandbox.stub()
      })

      it('should call each all checkers with data and return undefined given no valid status', () => {
        const statuses = [undefined, undefined, undefined]
        const checkers = getCheckers(statuses)

        sandbox.stub(checker, 'checkers', checkers)

        const result = checker.getStatus(data)

        for (const index of statuses.keys()) {
          expect(
            subChecker.getCall(index)
              .calledWithExactly(data)
          ).to.be.true
        }
        expect(subChecker.calledThrice).to.be.true
        expect(result).to.be.undefined
      })

      it('should call checker until getting first valid status and return', () => {
        const status = {
          type: 'EVENT',
          execute: 'execute',
          passive: 'passive'
        }
        const statuses = [undefined, status, undefined]
        const checkers = getCheckers(statuses)

        sandbox.stub(checker, 'checkers', checkers)

        const result = checker.getStatus(data)

        expect(
          subChecker.firstCall
            .calledWithExactly(data)
        ).to.be.true
        expect(
          subChecker.secondCall
            .calledWithExactly(data)
        ).to.be.true
        expect(subChecker.calledTwice).to.be.true
        expect(result).to.be.equal(status)
      })
    })
  })
})
