// spec: https://github.com/estree/estree/blob/master/spec.md#continuestatement
// @TODO: label

describe('ContinueStatement tests', () => {
  let continueStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    continueStatement = createAstNode('ContinueStatement')

    sandbox.stub(esprimaParser, 'flowState', {
      set: sandbox.spy()
    })
  })

  it('should set flowState to FlowState.CONTINUE', () => {
    esprimaParser.ContinueStatement(continueStatement)

    expect(
      esprimaParser.flowState.set
        .calledWithExactly(FlowState.CONTINUE)
    ).to.be.true
  })

  it('should return undefined', () => {
    const result = esprimaParser.ContinueStatement(continueStatement)

    expect(result).to.be.undefined
  })
})
