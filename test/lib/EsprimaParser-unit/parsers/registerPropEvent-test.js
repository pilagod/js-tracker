describe('registerPropertyEvent tests', () => {
  const caller = {}
  const callee = 'prop'
  const target = {caller, callee}
  const value = 'value'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'createAddEventListenerFromPropEvent')
      .returns('resultFromCreateAddEventListenerFromPropEvent')
    sandbox.stub(esprimaParser, 'execute')
  })

  it('should call createAddEventListenerFromPropEvent with callee and value', () => {
    esprimaParser.registerPropEvent(target, value)

    expect(
      esprimaParser.createAddEventListenerFromPropEvent
        .calledWithExactly(callee, value)
    ).to.be.true
  })

  it('should call execute with an array containing caller and result from createAddEventListenerFromPropEvent', () => {
    esprimaParser.registerPropEvent(target, value)

    expect(
      esprimaParser.execute
        .calledWithExactly([caller, 'resultFromCreateAddEventListenerFromPropEvent'])
    ).to.be.true
  })
})
