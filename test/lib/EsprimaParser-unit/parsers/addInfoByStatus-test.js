describe('addInfoToElements tests', () => {
  const info = {
    elements: [],
    info: {}
  }
  it('should call addEvent of collection with info given status type CallChecker.EVENT', () => {
    const status = {
      type: esprimaParser.Collection.EVENT
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
      type: esprimaParser.Collection.MANIPULATION
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
