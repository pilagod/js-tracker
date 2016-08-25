describe('propManiChecker tests', () => {
  const libDir = '../../../../../lib/EsprimaParser'
  const { Callee, Collection } = require(`${libDir}/checkers/init-helper`)
  const propManiChecker = require(`${libDir}/checkers/HTMLElement/propManiChecker`)

  it('should return undefined given not matched data.callee', () => {
    const data = {
      callee: 'click'
    }
    const result = propManiChecker(data)

    expect(result).to.be.undefined
  })

  it('should return status with type Collection.EVENT given matched data.callee', () => {
    const data = {
      callee: 'innerHTML'
    }
    const result = propManiChecker(data)

    expect(result).to.be.eql({
      type: Collection.MANIPULATION
    })
  })
})
