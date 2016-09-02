require('./helpers/init')

const importAllFrom = require('import-all-from')

const registerHelpers = require('./helpers/registerHelpers')
const unregisterHelpers = require('./helpers/unregisterHelpers')

describe('EsprimaParser tests', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  before(() => {
    global.libDir = '../../../../lib/EsprimaParser'
  })

  after(() => {
    delete global.libDir
  })

  describe('constructor', () => {
    const CONSTRUCTOR_PATH = `${__dirname}/lib/EsprimaParser-unit/constructor`
    const EsprimaParser = require('../lib/EsprimaParser')

    before(() => {
      global.EsprimaParser = EsprimaParser
    })

    after(() => {
      delete global.EsprimaParser
    })

    importAllFrom(CONSTRUCTOR_PATH)
  })

  describe('parsers', () => {
    const PARSERS_PATH = `${__dirname}/lib/EsprimaParser-unit/parsers`
    const EsprimaParser = require('../lib/EsprimaParser')
    const esprimaParserHelpers = require('./lib/EsprimaParser-unit/helpers')

    before(() => {
      registerHelpers(esprimaParserHelpers)
    })

    beforeEach(() => {
      global.esprimaParser = new EsprimaParser(global)
    })

    after(() => {
      delete global.esprimaParser
      unregisterHelpers(esprimaParserHelpers)
    })

    importAllFrom(PARSERS_PATH)
  })

  describe('structures', () => {
    const STRUCTURES_PATH = `${__dirname}/lib/EsprimaParser-unit/structures`

    importAllFrom(STRUCTURES_PATH)
  })

  describe('dispatchers', () => {
    const DISPATCHERS_PATH = `${__dirname}/lib/EsprimaParser-unit/dispatchers`

    /* init dispatchers */
    require('./helpers/initDispatchers')(global)

    before(() => {
      global.importAllFrom = importAllFrom
    })

    after(() => {
      delete global.importAllFrom
      delete global.DISPATCHERS
    })

    importAllFrom(DISPATCHERS_PATH)
  })

  describe('checkers', () => {
    const CHECKERS_PATH = `${__dirname}/lib/EsprimaParser-unit/checkers`

    importAllFrom(CHECKERS_PATH)
  })
})
