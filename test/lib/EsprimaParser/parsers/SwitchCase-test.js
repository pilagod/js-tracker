// spec: https://github.com/estree/estree/blob/master/spec.md#switchcase

describe('SwitchCase tests', () => {
  let switchCase

  beforeEach(() => {
    switchCase = createAstNode('SwitchCase', {
      consequent: [
        createAstNode('Statement1'),
        createAstNode('Statement2'),
        createAstNode('Statement3')
      ]
    })

    sandbox.stub(esprimaParser, 'parseStatements', sandbox.spy(() => {
      return 'resultFromParseStatements'
    }))
  })

  it('should call parseStatements with consequent and return', () => {
    const result = esprimaParser.SwitchCase(switchCase)

    expect(
      esprimaParser.parseStatements
        .calledWithExactly(switchCase.consequent)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseStatements')
  })
})
