// spec: https://github.com/estree/estree/blob/master/spec.md#switchstatement

describe('SwitchStatement tests', () => {
  let switchStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    switchStatement = createAstNode('SwitchStatement', {
      discriminant: createAstNode('Expression'),
      cases: [
        createAstNode('SwitchCase1'),
        createAstNode('SwitchCase2'),
        createAstNode('SwitchCase3')
      ]
    })

    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(switchStatement.discriminant)
        .returns('parsedDiscriminant')
    sandbox.stub(esprimaParser, 'parseSwitchCases')
      .returns('resultFromParseSwitchCases')
    sandbox.stub(esprimaParser, 'flowState', {
      unset: sandbox.spy()
    })
  })

  it('should call parseNode with discriminant', () => {
    esprimaParser.SwitchStatement(switchStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(switchStatement.discriminant)
    ).to.be.true
  })

  it('should call parseSwitchCases with cases and parsed discriminant', () => {
    esprimaParser.SwitchStatement(switchStatement)

    expect(
      esprimaParser.parseSwitchCases
        .calledWithExactly(switchStatement.cases, 'parsedDiscriminant')
    ).to.be.true
  })

  it('should unset flowState of FlowState.BREAK', () => {
    // switch should not unset return, and there is no continue statement in it
    esprimaParser.SwitchStatement(switchStatement)

    expect(
      esprimaParser.flowState.unset
        .calledWithExactly(FlowState.BREAK)
    ).to.be.true
  })
})
