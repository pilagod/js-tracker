describe('getEnvironment tests', () => {
  let context

  beforeEach(() => {
    context = {
      scriptUrl: 'scriptUrl',
      closureStack: {
        getClone: sandbox.stub().returns('closureStack')
      }
    }
  })

  it('should return an object containing given context\'s scriptUrl and copy of closureStack', () => {
    const result = esprimaParser.getEnvironment(context)

    expect(context.closureStack.getClone.called).to.be.true
    expect(result).to.be.eql({
      scriptUrl: 'scriptUrl',
      closureStack: 'closureStack'
    })
  })
})
