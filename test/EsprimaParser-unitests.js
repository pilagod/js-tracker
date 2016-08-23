const importAllFrom = require('import-all-from')

const registerHelpers = require('./helpers/registerHelpers')
const unregisterHelpers = require('./helpers/unregisterHelpers')

describe('EsprimaParser tests', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  describe.only('parsers tests', () => {
    const PARSERS_PATH = __dirname + '/lib/EsprimaParser/parsers'
    const EsprimaParser = require('../lib/EsprimaParser')
    const esprimaParserHelpers = require('./lib/EsprimaParser/helpers')

    before(() => {
      registerHelpers(esprimaParserHelpers)
    })

    beforeEach(() => {
      global.esprimaParser = new EsprimaParser()
    })

    after(() => {
      delete global.esprimaParser
      unregisterHelpers(esprimaParserHelpers)
    })

    importAllFrom(PARSERS_PATH)
  })

  describe('structures tests', () => {
    const STRUCTURES_PATH = __dirname + '/lib/EsprimaParser/structures'

    importAllFrom(STRUCTURES_PATH)
  })
})
