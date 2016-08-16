describe('createAddEventListenerFromPropEvent tests', () => {
  const propEvent = 'onclick'
  const handler = function () {}

  let setArgumentsSpy

  beforeEach(() => {
    setArgumentsSpy = sandbox.spy()

    sandbox.stub(esprimaParser, 'Method', function (method) {
      this.method = method
      this.setArguments = setArgumentsSpy
    })
    sandbox.stub(esprimaParser, 'getEventFromPropEvent')
      .returns('resultFromGetEventFromPropEvent')
  })

  it('should new a Method with string \'addEventListener\'', () => {
    esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(
      esprimaParser.Method
        .calledWithExactly('addEventListener')
    ).to.be.true
  })

  it('should call getEventFromPropEvent with propEvent', () => {
    esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(
      esprimaParser.getEventFromPropEvent
        .calledWithExactly(propEvent)
    ).to.be.true
  })

  it('should call setArguments of Method with an array containing result from getEventFromPropEvent and handler', () => {
    esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(
      setArgumentsSpy
        .calledWithExactly(['resultFromGetEventFromPropEvent', handler])
    ).to.be.true
  })

  it('should return addEventListener Method instance', () => {
    const result = esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(result).to.be.instanceof(esprimaParser.Method)
    expect(result.method).to.be.equal('addEventListener')
  })
})
