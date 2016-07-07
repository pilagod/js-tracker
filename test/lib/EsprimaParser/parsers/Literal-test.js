'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#literal

describe('Literal tests', () => {
  let literal

  beforeEach(() => {
    literal = createAstNode('Literal')
  })

  it('should return \'string\' given value \'string\'', () => {
    literal.value = 'string'

    const result = esprimaParser.Literal(literal)

    expect(result).to.be.equal('string')
  })

  it('should return 1 given value 1', () => {
    literal.value = 1

    const result = esprimaParser.Literal(literal)

    expect(result).to.be.equal(1)
  })

  it('should return true given value true', () => {
    literal.value = true

    const result = esprimaParser.Literal(literal)

    expect(result).to.be.equal(true)
  })

  it('should return null given value null', () => {
    literal.value = null

    const result = esprimaParser.Literal(literal)

    expect(result).to.be.equal(null)
  })

  it('should return regexp given regex', () => {
    literal.regex = {
      pattern: '\\w+',
      flags: 'g'
    }

    const result = esprimaParser.Literal(literal)

    expect(result).to.be.instanceof(RegExp)
    expect('this is a string'.match(result)).to.be.eql(['this', 'is', 'a', 'string'])
  })
})
