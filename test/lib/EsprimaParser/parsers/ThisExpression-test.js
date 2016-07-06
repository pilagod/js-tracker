'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#thisexpression

describe('ThisExpression tests', () => {
  let thisExpression

  beforeEach(() => {
    thisExpression = createAstNode('ThisExpression')

    sandbox.stub(esprimaParser, 'closureStack', createClosureStackStub())
  })

  it('should return esprimaParser given context esprimaParser', () => {
    esprimaParser.closureStack.set('this', esprimaParser)

    expect(esprimaParser.ThisExpression(thisExpression)).to.be.equal(esprimaParser)
  })

  it('should return undefined given no context', () => {
    esprimaParser.closureStack.set('this', undefined)

    expect(esprimaParser.ThisExpression(thisExpression)).to.be.equal(undefined)
  })
})
