describe('CallChecker tests', () => {
  const importAllFrom = require('import-all-from')
  const CallChecker = require('../../../../lib/EsprimaParser/structures/CallChecker')

  describe('constructor tests', () => {
    it('should set context to given context', () => {
      const context = {}

      const callChecker = new CallChecker(context)

      expect(callChecker.context).to.be.equal(context)
    })

    it('should set checkers to an array containing all checkers under ./Checkers', () => {
      const checkers = importAllFrom(__dirname + '/../../../../lib/EsprimaParser/structures/CallChecker/Checkers')

      const callChecker = new CallChecker(context)

      expect(callChecker.checkers).to.be.eql(checkers)
    })
  })

  describe('static tests', () => {
    describe('gettor of EVENT', () => {
      const EVENT = 'EVENT'

      it('should return string \'EVENT\'', () => {
        expect(CallChecker.EVENT).to.be.equal(EVENT)
      })
    })

    describe('getter of MANIPULATION', () => {
      const MANIPULATION = 'MANIPULATION'

      it('should return string \'MANIPULATION\'', () => {
        expect(CallChecker.MANIPULATION).to.be.equal(MANIPULATION)
      })
    })
  })

  describe('methods tests', () => {

  })
})
