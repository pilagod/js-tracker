describe('getLoopState tests', () => {
  let FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'flowState', {
      isLoopBreakState: sandbox.stub(),
      isLoopContinueState: sandbox.stub()
    })
  })

  it('should return FlowState.BREAK given isLoopBreakState return true', () => {
    esprimaParser.flowState.isLoopBreakState.returns(true)

    const result = esprimaParser.getLoopState()

    expect(result).to.be.equal(FlowState.BREAK)
  })

  it('should return FlowState.CONTINUE given isLoopContinueState return true', () => {
    esprimaParser.flowState.isLoopContinueState.returns(true)

    const result = esprimaParser.getLoopState()

    expect(result).to.be.equal(FlowState.CONTINUE)
  })

  it('should return undefined given isLoopBreakState and isLoopContinueState both return not true', () => {
    const result = esprimaParser.getLoopState()

    expect(result).to.be.undefined
  })
})
