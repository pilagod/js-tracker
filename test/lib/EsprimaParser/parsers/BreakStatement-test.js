// spec: https://github.com/estree/estree/blob/master/spec.md#breakstatement
// @TODO: label
describe('BreakStatement tests', () => {
  let breakStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    breakStatement = createAstNode('BreakStatement')

    sandbox.stub(esprimaParser, 'flowState', {
      set: sandbox.spy()
    })
  })

  it('should set flowState to FlowState.BREAK', () => {
    esprimaParser.BreakStatement(breakStatement)

    expect(
      esprimaParser.flowState.set
        .calledWithExactly(FlowState.BREAK)
    ).to.be.true
  })

  it('should return undefined', () => {
    const result = esprimaParser.BreakStatement(breakStatement)

    expect(result).to.be.undefined
  })
})
