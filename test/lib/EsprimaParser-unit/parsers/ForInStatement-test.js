// spec: https://github.com/estree/estree/blob/master/spec.md#forinstatement

describe('ForInStatement', () => {
  const label = 'label'
  const options = {label}
  const left = 'left'
  const rightLength = 3
  const right = {
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
    sandbox.stub(esprimaParser, 'parseIterator').returns(left)
    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(forInStatement.right).returns(right)
    sandbox.stub(esprimaParser, 'updateVariables')
    sandbox.stub(esprimaParser, 'isLoopNeededToBreak')
  })

  it('should call parseIterator with left', () => {
    esprimaParser.ForInStatement(forInStatement, options)

    expect(
      esprimaParser.parseIterator
        .calledWithExactly(forInStatement.left)
    ).to.be.true
  })

  it('should call parseNode with right', () => {
    esprimaParser.ForInStatement(forInStatement, options)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(forInStatement.right)
    ).to.be.true
  })

  it('should call updateVariables with left and keys in right each loop', () => {
    esprimaParser.ForInStatement(forInStatement, options)

    for (const key in right) {
      expect(
        esprimaParser.updateVariables
          .calledWithExactly(left, key)
      ).to.be.true
    }
    expect(esprimaParser.updateVariables.calledThrice).to.be.true
  })

  it('should call parseNode with body each loop after updateVariables', () => {
    esprimaParser.ForInStatement(forInStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledThrice
    ).to.be.true

    for (let i = 0; i < rightLength; i += 1) {
      expect(
        esprimaParser.parseNode
          .withArgs(forInStatement.body)
            .getCall(i)
              .calledAfter(esprimaParser.updateVariables.getCall(i))
      ).to.be.true
    }
  })

  it('should call isLoopNeededToBreak with options.label each loop', () => {
    esprimaParser.ForInStatement(forInStatement, options)

    expect(
      esprimaParser.isLoopNeededToBreak
        .withArgs(label).calledThrice
    ).to.be.true
  })

  it('should break loop if isLoopNeededToBreak returns true', () => {
    esprimaParser.isLoopNeededToBreak
      .onCall(1).returns(true)

    esprimaParser.ForInStatement(forInStatement, options)

    expect(
      esprimaParser.parseNode
        .withArgs(forInStatement.body).calledTwice
    ).to.be.true
  })

  const setParseNodeResults = () => {
    for (var index = 0; index < rightLength; index += 1) {
      esprimaParser.parseNode
        .withArgs(forInStatement.body)
          .onCall(index).returns(`resultFromParseNode${index + 1}`)
    }
  }

  it('should result from last parseNode called with body given loop never breaks', () => {
    setParseNodeResults()

    const result = esprimaParser.ForInStatement(forInStatement, options)

    expect(result).to.be.equal('resultFromParseNode3')
  })

  it('should return result from second parseNode called with body given loop breaks at second loop', () => {
    setParseNodeResults()
    esprimaParser.isLoopNeededToBreak
      .onCall(1).returns(true)

    const result = esprimaParser.ForInStatement(forInStatement, options)

    expect(result).to.be.equal('resultFromParseNode2')
  })
})
