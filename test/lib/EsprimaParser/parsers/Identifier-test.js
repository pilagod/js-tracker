'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#identifier

describe('Identifier tests', () => {
  let identifier

  beforeEach(() => {
    identifier = createAstNode('Identifier')

    sandbox.stub(esprimaParser, 'closureStack', createClosureStackStub())
  })

  it('should return 1 given \'name\': \'a\', whose value is 1', () => {
    identifier.name = 'a'
    esprimaParser.closureStack.set('a', 1)

    expect(esprimaParser.Identifier(identifier)).to.be.equal(1)
  })

  it('should return 2 given \'name\': \'b\', whose value is 2', () => {
    identifier.name = 'b'
    esprimaParser.closureStack.set('b', 2)

    expect(esprimaParser.Identifier(identifier)).to.be.equal(2)
  })

  it('should return undefined given \'name\': \'c\', which has no value assigned', () => {
    identifier.name = 'c'

    expect(esprimaParser.Identifier(identifier)).to.be.equal(undefined)
  })

  it('should return null given \'name\': \'null\'', () => {
    identifier.name = 'null'

    expect(esprimaParser.Identifier(identifier)).to.be.equal(null)
  })

  it('should return undefined given \'name\': \'undefined\'', () => {
    identifier.name = 'undefined'

    expect(esprimaParser.Identifier(identifier)).to.be.equal(undefined)
  })
})
