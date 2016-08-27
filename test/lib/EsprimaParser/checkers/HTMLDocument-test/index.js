describe('HTMLDocument tests', () => {
  const importAllFrom = require('import-all-from')
  const libDir = '../../../../../lib/EsprimaParser'
  const HTMLDocumentChecker = require(`${libDir}/checkers/HTMLDocument`)

  describe('checkers tests', () => {
    it('should import all checkers in dir under /checkers/HTMLDocument to checkers', () => {
      const checkers = importAllFrom(`${__dirname}/${libDir}/checkers/HTMLDocument`, {file: false})

      expect(HTMLDocumentChecker.checkers).to.be.eql(checkers)
    })
  })

  describe('check callback tests', () => {
    const HTMLDocument = function () {}

    it('should return true given data.caller is instanceof data.context.HTMLDocument', () => {
      const data = {
        context: {HTMLDocument},
        caller: new HTMLDocument()
      }
      const result = HTMLDocumentChecker.check(data)

      expect(result).to.be.true
    })

    it('should return false given data.caller is not instanceof data.context.HTMLDocument', () => {
      const data = {
        context: {HTMLDocument},
        caller: {}
      }
      const result = HTMLDocumentChecker.check(data)

      expect(result).to.be.false
    })
  })

  describe('sub checkers tests', () => {
    importAllFrom(__dirname, {
      regexp: /^((?!index.js).)*$/
    })
  })
})
