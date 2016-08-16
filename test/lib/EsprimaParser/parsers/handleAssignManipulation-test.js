describe('handleAssignManipulation tests', () => {
  const object = 'object'
  const property = 'property'
  const info = {
    code: 'code',
    loc: 'loc'
  }
  const value = 'value'

  let status, CallChecker

  before(() => {
    CallChecker = require('../../../../lib/EsprimaParser/structures/CallChecker')
  })

  beforeEach(() => {
    status = {
      type: 'STATE'
    }
    sandbox.stub(esprimaParser, 'addInfoToCollection')
    sandbox.stub(esprimaParser, 'registerPropEvent')
  })

  it('should call addInfoToCollection with object, property, info and status', () => {
    esprimaParser.handleAssignManipulation(object, property, info, value, status)

    expect(
      esprimaParser.addInfoToCollection
        .calledWithExactly(object, property, info, status)
    ).to.be.true
  })

  it('should call registerPropEvent with object, property, and value given CallChecker.EVENT type status', () => {
    status.type = CallChecker.EVENT

    esprimaParser.handleAssignManipulation(object, property, info, value, status)

    expect(
      esprimaParser.registerPropEvent
        .calledWithExactly(object, property, value)
    ).to.be.true
  })

  it('should not call registerPropertyEvent given CallChecker.MANIPULATION type status', () => {
    status.type = CallChecker.MANIPULATION
    esprimaParser.handleAssignManipulation(object, property, info, value, status)

    expect(esprimaParser.registerPropEvent.called).to.be.false
  })
})
