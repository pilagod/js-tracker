describe.only('initAssignmentOperators tests', () => {
  const context = {}
  let esprimaParser

  beforeEach(() => {
    esprimaParser = new EsprimaParser(context)
  })

  it('should return an object containing \'=\' property whose value is a function', () => {
    const result = esprimaParser.initAssignmentOperators()

    expect(result).to.have.property('=').that.is.a('function')
  })
})
