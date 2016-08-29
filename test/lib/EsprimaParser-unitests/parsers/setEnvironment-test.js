describe('setEnvironment tests', () => {
  let context

  beforeEach(() => {
    context = {
      scriptUrl: 'contextScriptUrl',
      closureStack: 'contextClosureStack'
    }
  })

  it('should set context environment to given environment', () => {
    const environment = {
      scriptUrl: 'scriptUrl',
      closureStack: 'closureStack'
    }

    esprimaParser.setEnvironment(context, environment)

    expect(context.scriptUrl).to.be.equal(environment.scriptUrl)
    expect(context.closureStack).to.be.equal(environment.closureStack)
  })
})
