describe('jQuery checker tests', () => {
  const importAllFrom = require('import-all-from')
  const libDir = '../../../../../lib/EsprimaParser'
  const jQueryChecker = require(`${libDir}/checkers/jQuery`)

  describe('checkers tests', () => {
    it('should import all checkers in dir under /checkers/jQuery to checkers', () => {
      const checkers = importAllFrom(`${__dirname}/${libDir}/checkers/jQuery`, {file: false})

      expect(jQueryChecker.checkers).to.be.eql(checkers)
    })
  })

  describe('check callback tests', () => {
    it('should return false given data.context has no jQuery property', () => {
      const data = {
        context: {}
      }
      const result = jQueryChecker.check(data)

      expect(result).to.be.false
    })

    it('should return true given data.caller is instanceof data.context.jQuery', () => {
      const jQuery = function () {}
      const data = {
        context: {jQuery},
        caller: new jQuery()
      }
      const result = jQueryChecker.check(data)

      expect(result).to.be.true
    })

    it('should return false given data.caller is not instanceof data.context.jQuery', () => {
      const jQuery = function () {}
      const data = {
        context: {jQuery},
        caller: {}
      }
      const result = jQueryChecker.check(data)

      expect(result).to.be.false
    })
  })

  describe('sub checkers tests', () => {
    importAllFrom(__dirname, {
      regexp: /^((?!index.js).)*$/
    })
  })
})
