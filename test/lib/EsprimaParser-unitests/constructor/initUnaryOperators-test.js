describe('initUnaryOperators tests', () => {
  const context = {}
  let esprimaParser

  beforeEach(() => {
    esprimaParser = new EsprimaParser(context)
  })

  it('should return an object concating given argument object with delete property whose value is a function', () => {
    const unaryOperators = {
      'op1': () => {},
      'op2': () => {}
    }
    const result = esprimaParser.initUnaryOperators(unaryOperators)

    expect(Object.keys(result)).to.be.have.lengthOf(3)
    expect(result).to.have.property('op1').that.equal(unaryOperators.op1)
    expect(result).to.have.property('op2').that.equal(unaryOperators.op2)
    expect(result).to.have.property('delete').that.is.a('function')
  })
})
