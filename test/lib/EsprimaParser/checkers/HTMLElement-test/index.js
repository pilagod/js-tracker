describe('HTMLElement checker tests', () => {
  const importAllFrom = require('import-all-from')
  const libDir = '../../../../../lib/EsprimaParser'
  const elementChecker = require(`${libDir}/checkers/HTMLElement`)

  describe('checkers tests', () => {
    it('should import all checkers in dir under /checkers/HTMLElement to checkers', () => {
      const checkers = importAllFrom(`${__dirname}/${libDir}/checkers/HTMLElement`, {file: false})

      expect(elementChecker.checkers).to.be.eql(checkers)
    })
  })

  describe('check callback tests', () => {
    it('should return true given data.caller is instanceof data.context.HTMLElement', () => {
      const HTMLElement = function () {}
      const data = {
        context: {HTMLElement},
        caller: new HTMLElement()
      }
      const result = elementChecker.check(data)

      expect(result).to.be.true
    })

    it('should return false given data.caller is not instanceof data.context.HTMLElement', () => {
      const HTMLElement = function () {}
      const data = {
        context: {HTMLElement},
        caller: {}
      }
      const result = elementChecker.check(data)

      expect(result).to.be.false
    })
  })

  describe('sub checkers tests', () => {
    importAllFrom(__dirname, {
      regexp: /^((?!index.js).)*$/
    })
  })
})
