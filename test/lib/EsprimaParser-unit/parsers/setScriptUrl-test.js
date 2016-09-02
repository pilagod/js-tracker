describe('setScriptUrl tests', () => {
  it('should set esprimaParser.scriptUrl to given scriptUrl', () => {
    const scriptUrl = 'scriptUrl'

    expect(esprimaParser.scriptUrl).to.be.null

    esprimaParser.setScriptUrl(scriptUrl)

    expect(esprimaParser.scriptUrl).to.be.equal(scriptUrl)
  })
})
