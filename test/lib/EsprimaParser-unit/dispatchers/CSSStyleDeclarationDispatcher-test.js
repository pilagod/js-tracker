describe('CSSStyleDeclaration dispatcher tests', () => {
  let Collection, styleDispatcher

  before(() => {
    Collection = require(`${libDir}/structures/Collection`)
    styleDispatcher = require(`${libDir}/dispatchers/CSSStyleDeclarationDispatcher`)
  })

  it('should return status {type: Collection.MANIPULATION} when called with data whose caller is instanceof context.CSSStyleDeclaration', () => {
    const CSSStyleDeclaration = function () {}
    const data = {
      context: {CSSStyleDeclaration},
      caller: new CSSStyleDeclaration()
    }
    const result = styleDispatcher(data)

    expect(result).to.be.eql({
      type: Collection.MANIPULATION
    })
  })

  it('should return undefined when called with data whose context has no CSSStyleDeclaration', () => {
    const data = {
      context: {}
    }
    const result = styleDispatcher(data)

    expect(result).to.be.undefined
  })

  it('should return undefined when called with data whose context has CSSStyleDeclaration but caller is not instanceof CSSStyleDeclaration', () => {
    const CSSStyleDeclaration = function () {}
    const data = {
      context: {CSSStyleDeclaration},
      caller: {}
    }
    const result = styleDispatcher(data)

    expect(result).to.be.undefined
  })
})
