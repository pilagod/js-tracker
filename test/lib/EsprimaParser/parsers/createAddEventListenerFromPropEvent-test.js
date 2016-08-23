describe('createAddEventListenerFromPropEvent tests', () => {
  const propEvent = 'onclick'
  const handler = function () {}

  let addArgumentsSpy

  beforeEach(() => {
    addArgumentsSpy = sandbox.spy()

    sandbox.stub(esprimaParser, 'CalleeAgent', function (callee) {
      this.callee = callee
      this.addArguments = addArgumentsSpy
    })
    sandbox.stub(esprimaParser, 'getEventFromPropEvent')
      .returns('resultFromGetEventFromPropEvent')
  })

  it('should new a Method with string \'addEventListener\'', () => {
    esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(
      esprimaParser.CalleeAgent
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

  it('should call addArguments of CalleeAgent with an array containing result from getEventFromPropEvent and handler', () => {
    esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(
      addArgumentsSpy
        .calledWithExactly(['resultFromGetEventFromPropEvent', handler])
    ).to.be.true
  })

  it('should return addEventListener CalleeAgent instance', () => {
    const result = esprimaParser.createAddEventListenerFromPropEvent(propEvent, handler)

    expect(result).to.be.instanceof(esprimaParser.CalleeAgent)
    expect(result.callee).to.be.equal('addEventListener')
  })
})
