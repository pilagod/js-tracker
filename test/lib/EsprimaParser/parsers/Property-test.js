// spec: https://github.com/estree/estree/blob/master/spec.md#property

describe('Property tests', () => {
  let property

  beforeEach(() => {
    property = createAstNode('Property', {
      key: createAstNode('Literal', {value: 'a'}),
      value: createAstNode('Literal', {value: 1})
    })

    sandbox.stub(esprimaParser, 'getPropertyKeyOfString', sandbox.spy(createLiteralStub()))
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(createLiteralStub()))
  })

  it('should return an object contains key and value', () => {
    const result = esprimaParser.Property(property)

    expect(result).to.have.property('key')
    expect(result).to.have.property('value')
  })

  it('should call getPropertyKeyOfString with key and computed', () => {
    esprimaParser.Property(property)

    expect(
      esprimaParser.getPropertyKeyOfString
        .calledWithExactly(property.key, property.computed)
    ).to.be.true
  })

  it('should call parseNode with value', () => {
    esprimaParser.Property(property)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(property.value)
    ).to.be.true
  })

  it('should return {key: \'a\', value: 1} given property key \'a\' and value 1', () => {
    const result = esprimaParser.Property(property)

    expect(result).to.be.eql({key: 'a', value: 1})
  })
})
