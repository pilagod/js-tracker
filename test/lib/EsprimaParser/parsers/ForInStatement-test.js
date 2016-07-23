// spec: https://github.com/estree/estree/blob/master/spec.md#forinstatement

describe('ForInStatement', () => {
  const leftStub = 'name of left'
  const rightStubLength = 2
  const rightStub = {
    'a': 1,
    'b': 2,
    'c': 3
  }
  let forInStatement

  beforeEach(() => {
    forInStatement = createAstNode('ForInStatement', {
      left: createAstNode('VariableDeclaration|Pattern'),
      right: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'getName')
      .returns(leftStub)
    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(forInStatement.right)
        .returns(rightStub)
    sandbox.stub(esprimaParser, 'updateVariables')
    sandbox.stub(esprimaParser, 'closureStack', {
      update: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'getLoopStatusAndReset')
  })

  it('should call getName with left', () => {
    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.getName
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

  it('should call updateVariables with left name and right key each loop', () => {
    esprimaParser.ForInStatement(forInStatement)

    for (const key in rightStub) {
      expect(
        esprimaParser.updateVariables
          .calledWithExactly(leftStub, key)
      ).to.be.true
    }
    expect(esprimaParser.updateVariables.calledThrice).to.be.true
  })

  it('should call parseNode with body after updating left in each loop', () => {
    esprimaParser.ForInStatement(forInStatement)

    for (let i = 0; i < rightStubLength; i += 1) {
      expect(
        esprimaParser.parseNode
          .withArgs(forInStatement.body)
            .getCall(i)
            .calledAfter(
              esprimaParser.updateVariables
                .getCall(i)
            )
      ).to.be.true
    }
    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledThrice
    ).to.be.true
  })

  it('should call getLoopStatusAndReset after parsing body each loop', () => {
    esprimaParser.ForInStatement(forInStatement)

    for (let i = 0; i < rightStubLength; i += 1) {
      expect(
        esprimaParser.getLoopStatusAndReset
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(forInStatement.body)
              .getCall(i)
          )
      ).to.be.true
    }
    expect(esprimaParser.getLoopStatusAndReset.calledThrice).to.be.true
  })

  it('should break loop given getLoopStatusAndReset returns \'break\' status', () => {
    esprimaParser.getLoopStatusAndReset
      .onCall(1).returns('break')

    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledTwice
    ).to.be.true
    expect(esprimaParser.updateVariables.calledTwice).to.be.true
  })

  it('should return parsed body result', () => {
    esprimaParser.parseNode
      .withArgs(forInStatement.body)
        .returns('parsedStatement')

    const result = esprimaParser.ForInStatement(forInStatement)

    expect(result).to.be.equal('parsedStatement')
  })
})
