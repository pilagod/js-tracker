require('./helpers/init')

/* init variables */
global.esprima = require('esprima')
global.EsprimaParser = require('../lib/EsprimaParser')
global.resetVariables = require('./lib/EsprimaParser-integration/helpers/resetVariables')

before(() => {
  global.esprimaParser = new EsprimaParser(global)
})

/* init esprimaParser */
beforeEach(() => {
  global.esprimaParser = new EsprimaParser(global)
})

describe('canary test', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })
})
