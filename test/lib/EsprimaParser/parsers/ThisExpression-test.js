'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#thisexpression

describe('ThisExpression tests', () => {
  let thisExpression

  beforeEach(() => {
    thisExpression = createAstNode('ThisExpression')

    sandbox.stub(esprimaParser, 'closureStack', createClosureStackStub())
  })

  it('should call get of closureStack with \'this\'', () => {
    esprimaParser.closureStack.get = sandbox.spy()

    esprimaParser.ThisExpression(thisExpression)

    expect(
      esprimaParser.closureStack.get
        .calledWithExactly('this')
    ).to.be.true
  })

  it('should return esprimaParser given context esprimaParser', () => {
    esprimaParser.closureStack.set('this', esprimaParser)

    const result = esprimaParser.ThisExpression(thisExpression)

    expect(result).to.be.equal(esprimaParser)
  })

  it('should return undefined given no context', () => {
    esprimaParser.closureStack.set('this', undefined)

    const result = esprimaParser.ThisExpression(thisExpression)

    expect(result).to.be.equal(undefined)
  })
})
