describe('initAssignmentOperators tests', () => {
  const context = {}
  let esprimaParser

  beforeEach(() => {
    esprimaParser = new EsprimaParser(context)
  })

  it('should return an object concating given argument object with \'=\' property whose value is a function', () => {
    const assignmentOperators = {
      'op1': () => {},
      'op2': () => {}
    }
    const result = esprimaParser.initAssignmentOperators(assignmentOperators)

    expect(Object.keys(result)).to.be.have.lengthOf(3)
    expect(result).to.have.property('op1').that.equal(assignmentOperators.op1)
    expect(result).to.have.property('op2').that.equal(assignmentOperators.op2)
    expect(result).to.have.property('=').that.is.a('function')
  })
})
