describe('addInfoToElement tests', () => {
  const element = 'element'
  const info = {
    code: 'code',
    loc: 'loc'
  }
  let CallChecker

  before(() => {
    CallChecker = require('../../../../lib/EsprimaParser/structures/CallChecker')
  })

  it('should call addEvent of collection with element and info given status type CallChecker.EVENT', () => {
    const status = {
      type: CallChecker.EVENT
    }
    sandbox.stub(esprimaParser, 'collection', {
      addEvent: sandbox.spy()
    })
    esprimaParser.addInfoToElement(element, status, info)

    expect(
      esprimaParser.collection.addEvent
        .calledWithExactly(element, info)
    ).to.be.true
  })

  it('should call addManipulation of collection with element and info given status type CallChecker.MANIPULATION', () => {
    const status = {
      type: CallChecker.MANIPULATION
    }
    sandbox.stub(esprimaParser, 'collection', {
      addManipulation: sandbox.spy()
    })
    esprimaParser.addInfoToElement(element, status, info)

    expect(
      esprimaParser.collection.addManipulation
        .calledWithExactly(element, info)
    ).to.be.true
  })
})
