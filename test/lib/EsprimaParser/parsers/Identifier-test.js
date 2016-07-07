'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#identifier

describe('Identifier tests', () => {
  let identifier

  beforeEach(() => {
    identifier = createAstNode('Identifier')

    sandbox.stub(esprimaParser, 'closureStack', createClosureStackStub())
  })

  it('should call get of closureStack with variable name', () => {
    identifier.name = 'a'

    esprimaParser.closureStack.get = sandbox.spy()

    esprimaParser.Identifier(identifier)

    expect(
      esprimaParser.closureStack.get
        .calledWithExactly('a')
    ).to.be.true
  })

  it('should return 1 given name \'a\', whose value is 1', () => {
    identifier.name = 'a'
    esprimaParser.closureStack.set('a', 1)

    expect(esprimaParser.Identifier(identifier)).to.be.equal(1)
  })

  it('should return undefined given name \'c\', which has no value assigned', () => {
    identifier.name = 'c'
    esprimaParser.closureStack.set('c', undefined)

    expect(esprimaParser.Identifier(identifier)).to.be.equal(undefined)
  })

  it('should return null given name \'null\'', () => {
    identifier.name = 'null'

    expect(esprimaParser.Identifier(identifier)).to.be.equal(null)
  })

  it('should return undefined given name \'undefined\'', () => {
    identifier.name = 'undefined'

    expect(esprimaParser.Identifier(identifier)).to.be.equal(undefined)
  })
})
