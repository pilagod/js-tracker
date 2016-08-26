describe('CSSStyleDeclaration checker tests', () => {
  const libDir = '../../../../../lib/EsprimaParser'
  const { Collection } = require(`${libDir}/checkers/init-helper`)
  const CSSStyleDeclarationChecker = require(`${libDir}/checkers/CSSStyleDeclaration`)

  describe('dispatch tests', () => {
    const CSSStyleDeclaration = function () {}

    it('should return status of type MANIPULATION given data.caller is instanceof CSSStyleDeclaration', () => {
      const data = {
        context: {CSSStyleDeclaration},
        caller: new CSSStyleDeclaration()
      }
      const result = CSSStyleDeclarationChecker.dispatch(data)

      expect(result).to.be.eql({
        type: Collection.MANIPULATION
      })
    })

    it('should return undefined given data.caller is not instanceof CSSStyleDeclaration', () => {
      const data = {
        context: {CSSStyleDeclaration},
        caller: {}
      }
      const result = CSSStyleDeclarationChecker.dispatch(data)

      expect(result).to.be.undefined
    })
  })
})
