describe('isInPrototypeChain tests', () => {
  const currentObject = {}
  const targetPrototype = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isPrototypeMatched')
      .returns('resultFromIsPrototypeMatched')
    sandbox.stub(Object, 'getPrototypeOf')
      .returns('resultFromObjectGetPrototypeOf')
  })

  it('should call getPrototypeOf of Object with currentObject', () => {
    esprimaParser.isInPrototypeChain(currentObject, targetPrototype)

    expect(
      Object.getPrototypeOf
        .calledWithExactly(currentObject)
    ).to.be.true
  })

  it('should call isPrototypeMatched with result from getPrototypeOf of Object and prototype of right', () => {
    const result = esprimaParser.isInPrototypeChain(currentObject, targetPrototype)

    expect(
      esprimaParser.isPrototypeMatched
        .calledWithExactly('resultFromObjectGetPrototypeOf', targetPrototype)
    ).to.be.true
    expect(result).to.be.equal('resultFromIsPrototypeMatched')
  })
})
