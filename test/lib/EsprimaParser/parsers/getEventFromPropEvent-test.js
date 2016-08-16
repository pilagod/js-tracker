describe('getEventFromPropEvent tests', () => {
  it('should return click given onclick', () => {
    const result = esprimaParser.getEventFromPropEvent('onclick')

    expect(result).to.be.equal('click')
  })
})
