for (const DISPATCHER of global.DISPATCHERS) {
  const type = DISPATCHER.type
  let workDir, CONSTANTS

  describe(`${type}`, () => {
    describe('call-event tests', () => {
      let callEventChecker

      before(() => {
        workDir = `${libDir}/dispatchers/${type}Dispatcher/callDispatcher/checkers/event`
        CONSTANTS = require(`${workDir}/constants`)
        callEventChecker = require(workDir)
      })

      it('should return status {type: Collection.EVENT} given data whose callee\'s method matched', () => {
        const data = {}
        let key, result

        for (key of Object.keys(CONSTANTS)) {
          data.callee = new Callee(key)
          result = callEventChecker(data)

          expect(result).to.be.eql({
            type: Collection.EVENT
          })
        }
      })

      it('should return undefined given data whose callee\'s method not matched', () => {
        const data = {
          callee: new Callee('otherMethod')
        }
        const result = callEventChecker(data)

        expect(result).to.be.undefined
      })
    })

    describe('call-mani tests', () => {
      let callManiChecker

      before(() => {
        workDir = `${libDir}/dispatchers/${type}Dispatcher/callDispatcher/checkers/mani`
        CONSTANTS = require(`${workDir}/constants`)
        callManiChecker = require(workDir)
      })

      it('should return status {type: Collection.MANIPULATION, execute: undefined} given data whose callee\'s method matched', () => {
        const data = {}
        let key, result

        for (key of Object.keys(CONSTANTS)) {
          data.callee = new Callee(key)
          result = callManiChecker(data)

          expect(result).to.be.eql({
            type: Collection.MANIPULATION,
            execute: undefined
          })
        }
      })

      it('should return undefined given data whose callee\'s method not matched', () => {
        const data = {
          callee: new Callee('otherMethod')
        }
        const result = callManiChecker(data)

        expect(result).to.be.undefined
      })
    })

    describe('prop-event tests', () => {
      let propEventChecker

      before(() => {
        workDir = `${libDir}/dispatchers/${type}Dispatcher/propDispatcher/checkers/event`
        CONSTANTS = require(`${workDir}/constants`)
        propEventChecker = require(workDir)
      })

      it('should return status {type: Collection.EVENT} given data whose callee\'s method matched', () => {
        const data = {}
        let key, result

        for (key of Object.keys(CONSTANTS)) {
          data.callee = key
          result = propEventChecker(data)

          expect(result).to.be.eql({
            type: Collection.EVENT
          })
        }
      })

      it('should return undefined given data whose callee\'s method not matched', () => {
        const data = {
          callee: 'otherMethod'
        }
        const result = propEventChecker(data)

        expect(result).to.be.undefined
      })
    })

    describe('prop-mani tests', () => {
      let propManiChecker

      before(() => {
        workDir = `${libDir}/dispatchers/${type}Dispatcher/propDispatcher/checkers/mani`
        CONSTANTS = require(`${workDir}/constants`)
        propManiChecker = require(workDir)
      })

      it('should return status {type: Collection.MANIPULATION} given data whose callee\'s method matched', () => {
        const data = {}
        let key, result

        for (key of Object.keys(CONSTANTS)) {
          data.callee = key
          result = propManiChecker(data)

          expect(result).to.be.eql({
            type: Collection.MANIPULATION
          })
        }
      })

      it('should return undefined given data whose callee\'s method not matched', () => {
        const data = {
          callee: 'otherMethod'
        }
        const result = propManiChecker(data)

        expect(result).to.be.undefined
      })
    })
  })
}
