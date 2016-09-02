require('./helpers/init')

/* init variables */
global.esprima = require('esprima')
global.EsprimaParser = require('../lib/EsprimaParser')

/* init esprimaParser */
beforeEach(() => {
  global.esprimaParser = new EsprimaParser(global)
})

describe('canary test', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })
})
