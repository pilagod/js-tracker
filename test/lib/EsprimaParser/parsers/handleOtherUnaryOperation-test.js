'use strict'

describe('handleOtherUnaryOperation tests', () => {
  let argument, unaryOperationSpy

  beforeEach(() => {
    argument = createAstNode()
    unaryOperationSpy = sandbox.spy(() => 'resultFromUnaryOperation')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => 'parsedArgument'))
  })

  it('should call parseNode with argument', () => {
    esprimaParser.handleOtherUnaryOperation(argument, () => {})

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
  })

  it('should pass result from parseNode to unary operation', () => {
    esprimaParser.handleOtherUnaryOperation(argument, unaryOperationSpy)

    expect(unaryOperationSpy.calledWithExactly('parsedArgument')).to.be.true
  })

  it('should return result from unary operation', () => {
    const result = esprimaParser.handleOtherUnaryOperation(argument, unaryOperationSpy)

    expect(result).to.be.equal('resultFromUnaryOperation')
  })
})
