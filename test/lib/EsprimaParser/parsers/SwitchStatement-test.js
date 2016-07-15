// spec: https://github.com/estree/estree/blob/master/spec.md#switchstatement

describe('SwitchStatement tests', () => {
  let switchStatement

  beforeEach(() => {
    switchStatement = createAstNode('SwitchStatement', {
      discriminant: 'discriminant',
      cases: [
        createAstNode('SwitchCase1'),
        createAstNode('SwitchCase2'),
        createAstNode('SwitchCase3')
      ]
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => {
      return 'parsedDiscriminant'
    }))
    sandbox.stub(esprimaParser, 'parseSwitchCases', sandbox.spy(() => {
      return 'resultFromParseSwitchCases'
    }))
  })

  it('should call parseNode with discriminant', () => {
    esprimaParser.SwitchStatement(switchStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly('discriminant')
    ).to.be.true
  })

  it('should call parseSwitchCases with cases and parsed discriminant then return', () => {
    const result = esprimaParser.SwitchStatement(switchStatement)

    expect(
      esprimaParser.parseSwitchCases
        .calledWithExactly(switchStatement.cases, 'parsedDiscriminant')
    ).to.be.true
    expect(result).to.be.equal('resultFromParseSwitchCases')
  })
})
