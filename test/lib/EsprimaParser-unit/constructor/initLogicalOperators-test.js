describe.only('initLogicalOperators tests', () => {
  const context = {}
  let esprimaParser

  beforeEach(() => {
    esprimaParser = new EsprimaParser(context)
  })

  it('should return an object containing \'||\' and \'&&\' which both are functions', () => {
    const result = esprimaParser.initLogicalOperators()

    expect(result).to.have.property('||').that.is.a('function')
    expect(result).to.have.property('&&').that.is.a('function')
  })
})
