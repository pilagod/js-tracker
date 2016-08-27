describe('propEventChecker tests', () => {
  const libDir = '../../../../../lib/EsprimaParser'
  const { Callee, Collection } = require(`${libDir}/checkers/init-helper`)
  const propEventChecker = require(`${libDir}/checkers/HTMLDocument/propEventChecker`)

  it('should return undefined given not matched data.callee', () => {
    const data = {
      callee: 'oncopy'
    }
    const result = propEventChecker(data)

    expect(result).to.be.undefined
  })

  it('should return status with type Collection.EVENT given matched data.callee', () => {
    const data = {
      callee: 'onselectionchange'
    }
    const result = propEventChecker(data)

    expect(result).to.be.eql({
      type: Collection.EVENT
    })
  })
})
