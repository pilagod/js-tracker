describe('addInfoToElements tests', () => {
  const info = {
    elements: [],
    info: {}
  }
  let Collection

  before(() => {
    Collection = require('../../../../lib/EsprimaParser/structures/Collection')
  })

  it('should call addEvent of collection with info given status type CallChecker.EVENT', () => {
    const status = {
      type: Collection.EVENT
    }
    sandbox.stub(esprimaParser, 'collection', {
      addEvent: sandbox.spy()
    })
    esprimaParser.addInfoByStatus(info, status)

    expect(
      esprimaParser.collection.addEvent
        .calledWithExactly(info)
    ).to.be.true
  })

  it('should call addManipulation of collection with info given status type CallChecker.MANIPULATION', () => {
    const status = {
      type: Collection.MANIPULATION
    }
    sandbox.stub(esprimaParser, 'collection', {
      addManipulation: sandbox.spy()
    })
    esprimaParser.addInfoByStatus(info, status)

    expect(
      esprimaParser.collection.addManipulation
        .calledWithExactly(info)
    ).to.be.true
  })
})
