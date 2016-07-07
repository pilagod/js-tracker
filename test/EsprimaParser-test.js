'use strict'

const importTestsFrom = require('./helpers/importTestsFrom')
const registerHelpers = require('./helpers/registerHelpers')
const unregisterHelpers = require('./helpers/unregisterHelpers')

describe('EsprimaParser tests', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  describe('parsers tests', () => {
    const PARSERS_PATH = './test/lib/EsprimaParser/parsers/'
    const EsprimaParser = require('../lib/EsprimaParser')
    const esprimaParserHelpers = require('./lib/EsprimaParser/helpers')

    console.log('esprimaParser:', new EsprimaParser());

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

    importTestsFrom(PARSERS_PATH)
  })
})
