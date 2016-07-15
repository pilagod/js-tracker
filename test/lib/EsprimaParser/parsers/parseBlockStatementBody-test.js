describe('parseBlockStatementBody tests', () => {
  const isFlowControlStatementStub = (
    results = [false, false, false]
  ) => {
    const returns = (function* () {
      for (const result of results) {
        yield result
      }
    })()
    return () => {
      return returns.next().value
    }
  }
  const setIsFlowControlStatementStubReturnValues = (returns) => {
    if (esprimaParser.isFlowControlStatement.restore) {
      esprimaParser.isFlowControlStatement.restore()
    }
    sandbox.stub(esprimaParser, 'isFlowControlStatement', sandbox.spy(
      isFlowControlStatementStub(returns)
    ))
  }
  let body

  beforeEach(() => {
    body = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3')
    ]

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((node) => {
      return `resultFrom${node.type}`
    }))
    setIsFlowControlStatementStubReturnValues()
  })

  it('should call parseNode with each body node given no flow control statement and return last result', () => {
    const result = esprimaParser.parseBlockStatementBody(body)

    body.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
    expect(result).to.be.equal('resultFromStatement3')
  })

  it('should call isFlowControlStatement with each body node type given no flow control statement', () => {
    esprimaParser.parseBlockStatementBody(body)

    body.forEach((node, index) => {
      expect(
        esprimaParser.isFlowControlStatement
          .getCall(index)
          .calledWithExactly(node.type)
      ).to.be.true
    })
  })

  it('should call parseNode with node until first flow control statement and return the result', () => {
    setIsFlowControlStatementStubReturnValues([false, true, false])

    const result = esprimaParser.parseBlockStatementBody(body)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(body[2])
    ).to.be.true
    expect(result).to.be.equal('resultFromStatement2')
  })

  it('should call isFlowControlStatement with node until first flow control statement', () => {
    setIsFlowControlStatementStubReturnValues([false, true, false])

    esprimaParser.parseBlockStatementBody(body)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(body[2])
    ).to.be.true
  })
})
