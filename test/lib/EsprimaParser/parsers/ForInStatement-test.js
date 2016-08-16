// spec: https://github.com/estree/estree/blob/master/spec.md#forinstatement

describe('ForInStatement', () => {
  const resultStub = 'resultFromParseLoopBody'
  const leftStub = 'name of left'
  const rightStub = {
    'a': 1,
    'b': 2,
    'c': 3
  }
  let forInStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    forInStatement = createAstNode('ForInStatement', {
      left: createAstNode('VariableDeclaration|Pattern'),
      right: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'getIteratorName')
      .returns(leftStub)
    sandbox.stub(esprimaParser, 'parseNode')
      .returns(rightStub)
    sandbox.stub(esprimaParser, 'updateVariables')
    sandbox.stub(esprimaParser, 'parseLoopBody')
      .returns([resultStub])
  })

  it('should call getIteratorName with left', () => {
    esprimaParser.ForInStatement(forInStatement)

    expect(
      esprimaParser.getIteratorName
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

  it('should call parseLoopBody with body each loop', () => {
    esprimaParser.ForInStatement(forInStatement)

    for (let i = 0; i < rightStub.length; i += 1) {
      expect(
        esprimaParser.parseLoopBody
          .getCall(i)
            .calledAfter(esprimaParser.updateVariables.getCall(i))
      ).to.be.true
    }
    expect(
      esprimaParser.parseLoopBody
        .withArgs(forInStatement.body).calledThrice
    ).to.be.true
  })

  it('should break loop given parseLoopBody return state FlowState.BREAK', () => {
    esprimaParser.parseLoopBody
      .onCall(1).returns([resultStub, FlowState.BREAK])

    esprimaParser.ForInStatement(forInStatement)

    expect(esprimaParser.updateVariables.calledTwice).to.be.true
    expect(esprimaParser.parseLoopBody.calledTwice).to.be.true
  })

  it('should return parsed body result', () => {
    const result = esprimaParser.ForInStatement(forInStatement)

    expect(result).to.be.equal(resultStub)
  })
})
