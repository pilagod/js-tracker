'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#literal

describe('Literal tests', () => {
  let literal

  beforeEach(() => {
    literal = createAstNode('Literal')
  })

  it('should return number given number \'value\'', () => {
    literal.value = 1

    expect(esprimaParser.Literal(literal)).to.be.equal(1)
  })

  it('should return string given string \'value\'', () => {
    literal.value = 'string'

    expect(esprimaParser.Literal(literal)).to.be.equal('string')
  })

  it('should return boolean given boolean \'value\'', () => {
    literal.value = true

    expect(esprimaParser.Literal(literal)).to.be.equal(true)
  })

  it('should return null given null \'value\'', () => {
    literal.value = null

    expect(esprimaParser.Literal(literal)).to.be.equal(null)
  })

  it('should return regexp given \'regex\'', () => {
    literal.regex = {
      pattern: '\\w+',
      flags: 'g'
    }

    let result = esprimaParser.Literal(literal)

    expect(result).to.be.instanceof(RegExp)
    expect('this is a string'.match(result)).to.be.eql(['this', 'is', 'a', 'string'])
  })
})
