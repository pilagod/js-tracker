describe('handleAssignManipulation tests', () => {
  const object = 'object'
  const property = 'property'
  const info = {}
  const value = 'value'

  let status, Collection

  before(() => {
    Collection = require('../../../../lib/EsprimaParser/structures/Collection')
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

  it('should call registerPropEvent with object, property, and value given Collection.EVENT type status', () => {
    status.type = Collection.EVENT

    esprimaParser.handleAssignManipulation(object, property, info, value, status)

    expect(
      esprimaParser.registerPropEvent
        .calledWithExactly(object, property, value)
    ).to.be.true
  })

  it('should not call registerPropertyEvent given Collection.MANIPULATION type status', () => {
    status.type = Collection.MANIPULATION
    esprimaParser.handleAssignManipulation(object, property, info, value, status)

    expect(esprimaParser.registerPropEvent.called).to.be.false
  })
})
