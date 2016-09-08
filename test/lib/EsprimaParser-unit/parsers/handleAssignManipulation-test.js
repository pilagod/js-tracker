describe('handleAssignManipulation tests', () => {
  const target = {
    caller: {},
    callee: {},
    info: {}
  }
  const value = 'value'
  let status

  beforeEach(() => {
    status = {
      type: 'STATE'
    }
    sandbox.stub(esprimaParser, 'addInfoToCollection')
    sandbox.stub(esprimaParser, 'registerPropEvent')
  })

  it('should call addInfoToCollection with target and status', () => {
    esprimaParser.handleAssignManipulation(target, value, status)

    expect(
      esprimaParser.addInfoToCollection
        .calledWithExactly(target, status)
    ).to.be.true
  })

  it('should call registerPropEvent with target and value given Collection.EVENT type status', () => {
    status.type = esprimaParser.Collection.EVENT

    esprimaParser.handleAssignManipulation(target, value, status)

    expect(
      esprimaParser.registerPropEvent
        .calledWithExactly(target, value)
    ).to.be.true
  })

  it('should not call registerPropertyEvent given Collection.MANIPULATION type status', () => {
    status.type = esprimaParser.Collection.MANIPULATION

    esprimaParser.handleAssignManipulation(target, value, status)

    expect(esprimaParser.registerPropEvent.called).to.be.false
  })
})
