describe('callManiChecker tests', () => {
  const libDir = '../../../../../lib/EsprimaParser'
  const { Callee, Collection } = require(`${libDir}/checkers/init-helper`)
  const callManiChecker = require(`${libDir}/checkers/HTMLDocument/callManiChecker`)

  it('should return undefined given data.callee is non-Callee instance', () => {
    const data = {
      callee: 'callee'
    }
    const result = callManiChecker(data)

    expect(result).to.be.undefined
  })
  //
  // it('should return undefined given not matched data.callee.method', () => {
  //   const data = {
  //     callee: new Callee('onclick')
  //   }
  //   const result = callManiChecker(data)
  //
  //   expect(result).to.be.undefined
  // })
  //
  // it('should return status with type Collection.MANIPULATION given matched data.callee.method', () => {
  //   const data = {
  //     callee: new Callee('appendChild')
  //   }
  //   const result = callManiChecker(data)
  //
  //   expect(result).to.be.eql({
  //     type: Collection.MANIPULATION,
  //     execute: undefined
  //   })
  // })
})
