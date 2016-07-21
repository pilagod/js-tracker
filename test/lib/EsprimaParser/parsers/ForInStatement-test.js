// spec: https://github.com/estree/estree/blob/master/spec.md#forinstatement

describe('ForInStatement', () => {
  const leftStub = 'name of left'
  const rightStub = {
    'a': 1,
    'b': 2,
    'c': 3
  }
  const rightStubLength = 2
  const setCheckStatusResults = (method, results) => {
    esprimaParser.status[method] =
      sandbox.spy(createResultsGenerator(results))
  }

  let forInStatement

  beforeEach(() => {
    forInStatement = createAstNode('ForInStatement', {
      left: createAstNode('VariableDeclaration|Pattern'),
      right: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'getNameFromDeclarationAndPattern')
      .returns(leftStub)
    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(forInStatement.right)
        .returns(rightStub)
    sandbox.stub(esprimaParser, 'closureStack', {
      update: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'status', {
      unset: sandbox.spy(),
      isLoopBreakStatus: () => {},
      isLoopContinueStatus: () => {}
    })
  })

  it('should call getNameFromDeclarationAndPattern with left', () => {
    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.getNameFromDeclarationAndPattern
        .calledWithExactly(forInStatement.left)
    ).to.be.true
  })

  it('should call parseNode with right', () => {
    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(forInStatement.right)
    ).to.be.true
  })

  it('should call update of closureStack with left name and right elements key before parsing body', () => {
    esprimaParser.ForInStatement(forInStatement)

    for (const key in rightStub) {
      expect(
        esprimaParser.closureStack.update
          .calledWithExactly(leftStub, key)
      ).to.be.true
    }
  })

  it('should call parseNode with body before updating left in each loop', () => {
    let i = 0
    let length = Object.keys(rightStub).length

    esprimaParser.ForInStatement(forInStatement)

    while (i < rightStubLength) {
      expect(
        esprimaParser.parseNode
          .withArgs(forInStatement.body)
            .getCall(i)
            .calledAfter(
              esprimaParser.closureStack.update
                .getCall(i)
            )
      ).to.be.true

      i += 1
    }
    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledThrice
    ).to.be.true
  })

  it('should call isLoopBreakStatus of esprimaParser status after parsing body each time test passes', () => {
    let i = 0

    setCheckStatusResults('isLoopBreakStatus', [false, false, false])

    esprimaParser.ForInStatement(forInStatement)

    while (i < rightStubLength) {
      expect(
        esprimaParser.status.isLoopBreakStatus
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(forInStatement.body)
              .getCall(i)
          )
      ).to.be.true

      i += 1
    }
    expect(esprimaParser.status.isLoopBreakStatus.calledThrice).to.be.true
  })

  it('should call isLoopContinueStatus of esprimaParser status after parsing body each time test passes', () => {
    let i = 0

    setCheckStatusResults('isLoopContinueStatus', [false, false, false])

    esprimaParser.ForInStatement(forInStatement)

    while (i < rightStubLength) {
      expect(
        esprimaParser.status.isLoopContinueStatus
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(forInStatement.body)
              .getCall(i)
          )
      ).to.be.true

      i += 1
    }
    expect(esprimaParser.status.isLoopContinueStatus.calledThrice).to.be.true
  })

  it('should break the loop and unset break status given isLoopBreakStatus returns true', () => {
    setCheckStatusResults('isLoopBreakStatus', [false, true, false])

    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledTwice
    ).to.be.true
    expect(
      esprimaParser.status.unset
        .calledWithExactly('break')
    ).to.be.true
  })

  it('should continue the loop and unset continue status given isLoopContinueStatus returns true', () => {
    setCheckStatusResults('isLoopContinueStatus', [false, true, false])

    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledThrice
    ).to.be.true
    expect(
      esprimaParser.status.unset
        .calledWithExactly('continue')
    ).to.be.true
  })

  it('should return parsed body result', () => {
    esprimaParser.parseNode
      .withArgs(forInStatement.body)
        .returns('parsedStatement')

    const result = esprimaParser.ForInStatement(forInStatement)

    expect(result).to.be.equal('parsedStatement')
  })
})
