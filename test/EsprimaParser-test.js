const importTestsFrom = require('./helpers/importTestsFrom')

describe('EsprimaParser tests', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  describe('parsers tests', () => {
    const PARSERS_PATH = './test/lib/EsprimaParser/parsers/'
    const EsprimaParser = require('../lib/EsprimaParser')

    beforeEach(() => {
      global.esprimaParser = new EsprimaParser()
    })

    after(() => {
      delete global.esprimaParser
    })

    importTestsFrom(PARSERS_PATH)
  })
})
