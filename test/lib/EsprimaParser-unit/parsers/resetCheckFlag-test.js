describe('resetCheckFlag tests', () => {
  it('should set checkFlag to false given true success', () => {
    esprimaParser.checkFlag = true

    esprimaParser.resetCheckFlag(true)

    expect(esprimaParser.checkFlag).to.be.false
  })

  it('should do nothing given false success', () => {
    esprimaParser.checkFlag = true

    esprimaParser.resetCheckFlag(false)

    expect(esprimaParser.checkFlag).to.be.true
  })
})
