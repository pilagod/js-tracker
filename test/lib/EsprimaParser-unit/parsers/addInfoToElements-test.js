describe('addInfoToElements tests', () => {
  const elements = 'elements'
  const info = {}

  let Collection

  before(() => {
    Collection = require('../../../../lib/EsprimaParser/structures/Collection')
  })

  it('should call addEvent of collection with elements and info given status type CallChecker.EVENT', () => {
    const status = {
      type: Collection.EVENT
    }
    sandbox.stub(esprimaParser, 'collection', {
      addEvent: sandbox.spy()
    })
    esprimaParser.addInfoToElements(elements, info, status)

    expect(
      esprimaParser.collection.addEvent
        .calledWithExactly(elements, info)
    ).to.be.true
  })

  it('should call addManipulation of collection with elements and info given status type CallChecker.MANIPULATION', () => {
    const status = {
      type: Collection.MANIPULATION
    }
    sandbox.stub(esprimaParser, 'collection', {
      addManipulation: sandbox.spy()
    })
    esprimaParser.addInfoToElements(elements, info, status)

    expect(
      esprimaParser.collection.addManipulation
        .calledWithExactly(elements, info)
    ).to.be.true
  })
})
