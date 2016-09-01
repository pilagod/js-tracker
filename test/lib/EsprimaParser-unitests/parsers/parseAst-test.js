describe('parseAst tests', () => {
  const root = {}
  const scriptUrl = 'scriptUrl'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setScriptUrl')
    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call setScriptUrl with given scriptUrl', () => {
    esprimaParser.parseAst(root, scriptUrl)

    expect(
      esprimaParser.setScriptUrl
        .calledWithExactly(scriptUrl)
    ).to.be.true
  })

  it('should call parseNode with root after setScriptUrl', () => {
    esprimaParser.parseAst(root, scriptUrl)

    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setScriptUrl)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledWithExactly(root)
    ).to.be.true
  })
})
