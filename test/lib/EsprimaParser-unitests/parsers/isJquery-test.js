describe('isJquery tests', () => {
  it('should return false given context has no jQuery property', () => {
    sandbox.stub(esprimaParser, 'context', {})

    const object = {}

    const result = esprimaParser.isJquery(object)

    expect(result).to.be.false
  })

  it('should return false given context has jQuery property but object is not instance of jQuery', () => {
    sandbox.stub(esprimaParser, 'context', {
      jQuery: function () {}
    })
    const object = {}

    const result = esprimaParser.isJquery(object)

    expect(result).to.be.false
  })

  it('should return true given context has jQuery property and object is instance of jQuery', () => {
    sandbox.stub(esprimaParser, 'context', {
      jQuery: function () {}
    })
    const object = new esprimaParser.context.jQuery()

    const result = esprimaParser.isJquery(object)

    expect(result).to.be.true
  })
})
