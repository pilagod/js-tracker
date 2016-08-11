describe('isPrototypeMatched tests', () => {
  it('should return false given null currentPrototype', () => {
    const currentPrototype = null
    const targetPrototype = null

    const result = esprimaParser.isPrototypeMatched(
      currentPrototype,
      targetPrototype
    )

    expect(result).to.be.false
  })

  it('should return true given currentPrototype equals to targetPrototype', () => {
    const currentPrototype = {}
    const targetPrototype = currentPrototype

    const result = esprimaParser.isPrototypeMatched(
      currentPrototype,
      targetPrototype
    )

    expect(result).to.be.true
  })

  it('should call isInPrototypeChain with currentPrototype and targetPrototype for default', () => {
    const currentPrototype = {name: 'currentPrototype'}
    const targetPrototype = {name: 'targetPrototype'}

    sandbox.stub(esprimaParser, 'isInPrototypeChain')
      .returns('resultFromIsInPrototypeChain')

    const result = esprimaParser.isPrototypeMatched(
      currentPrototype,
      targetPrototype
    )

    expect(
      esprimaParser.isInPrototypeChain
        .calledWithExactly(currentPrototype, targetPrototype)
    ).to.be.true
    expect(result).to.be.equal('resultFromIsInPrototypeChain')
  })
})
