describe('callEventChecker tests', () => {
  const libDir = '../../../../../lib/EsprimaParser'
  const { Callee, Collection } = require(`${libDir}/checkers/init-helper`)
  const callEventChecker = require(`${libDir}/checkers/HTMLElement/callEventChecker`)

  it('should return undefined given data.callee is non-Callee instance', () => {
    const data = {
      callee: 'callee'
    }
    const result = callEventChecker(data)

    expect(result).to.be.undefined
  })

  it('should return undefined given not matched data.callee.method', () => {
    const data = {
      callee: new Callee('click')
    }
    const result = callEventChecker(data)

    expect(result).to.be.undefined
  })

  it('should return status with type Collection.EVENT given matched data.callee.method', () => {
    const data = {
      callee: new Callee('addEventListener')
    }
    const result = callEventChecker(data)

    expect(result).to.be.eql({type: Collection.EVENT})
  })
})
