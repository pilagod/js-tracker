'use strict'

describe('handleOtherUnaryOperation tests', () => {
  let argument, operationSpy

  beforeEach(() => {
    argument = createAstNode()
    operationSpy = sandbox.spy(() => 'resultFromOperation')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => 'parsedArgument'))
  })

  it('should call parseNode with argument', () => {
    esprimaParser.handleOtherUnaryOperation(argument, () => {})

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
  })

  it('should pass result from parseNode to operation', () => {
    esprimaParser.handleOtherUnaryOperation(argument, operationSpy)

    expect(operationSpy.calledWithExactly('parsedArgument')).to.be.true
  })

  it('should return result from operation', () => {
    const result = esprimaParser.handleOtherUnaryOperation(argument, operationSpy)

    expect(result).to.be.equal('resultFromOperation')
  })
})
