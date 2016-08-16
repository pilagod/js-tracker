describe('registerPropertyEvent tests', () => {
  const object = 'object'
  const property = 'property'
  const value = 'value'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'createAddEventListenerFromPropEvent')
      .returns('resultFromCreateAddEventListenerFromPropEvent')
    sandbox.stub(esprimaParser, 'execute')
  })

  it('should call createAddEventListenerFromPropEvent with property and value', () => {
    esprimaParser.registerPropEvent(object, property, value)

    expect(
      esprimaParser.createAddEventListenerFromPropEvent
        .calledWithExactly(property, value)
    ).to.be.true
  })

  it('should call execute with an array containing object and result from createAddEventListenerFromPropEvent', () => {
    esprimaParser.registerPropEvent(object, property, value)

    expect(
      esprimaParser.execute
        .calledWithExactly([object, 'resultFromCreateAddEventListenerFromPropEvent'])
    ).to.be.true
  })
})
