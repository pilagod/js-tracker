describe('parseMemberExpression tests', () => {
  let memberExpression
  // @TODO: computed true / false
  // @TODO: call getPropertyKeyOfString on property
  beforeEach(() => {
    memberExpression = createAstNode('memberExpression', {
      object: createAstNode('Literal', {value: 'object'}),
      property: createAstNode('Literal', {value: 'property'}),
      computed: 'computed'
    })

    sandbox.stub(esprimaParser, 'getObjectAsArray', sandbox.spy(createLiteralStub()))
    sandbox.stub(esprimaParser, 'getPropertyAsString', sandbox.spy(createLiteralStub()))
  })

  it('should call getObjectAsArray with member object', () => {
    esprimaParser.parseMemberExpression(memberExpression)

    expect(
      esprimaParser.getObjectAsArray
        .calledWithExactly(memberExpression.object)
    ).to.be.true
  })

  it('should call getPropertyAsString with member property and computed', () => {
    esprimaParser.parseMemberExpression(memberExpression)

    expect(
      esprimaParser.getPropertyAsString
        .calledWithExactly(memberExpression.property, 'computed')
    ).to.be.true
  })

  it('should return [\'object\', \'property\'] given getObjectAsArray returns [\'object\']', () => {
    esprimaParser.getObjectAsArray.restore()
    sandbox.stub(esprimaParser, 'getObjectAsArray').returns(['object'])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.eql(['object', 'property'])
  })

  it('should return [\'object1\', \'object2\', \'property\'] given getObjectAsArray returns [\'object1\', \'object2\']', () => {
    esprimaParser.getObjectAsArray.restore()
    sandbox.stub(esprimaParser, 'getObjectAsArray').returns(['object'])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.eql(['object', 'property'])
  })

  it('should return [[1, 2, 3], \'property\'] given getObjectAsArray returns [[1, 2, 3]]', () => {
    esprimaParser.getObjectAsArray.restore()
    sandbox.stub(esprimaParser, 'getObjectAsArray').returns([[1, 2, 3]])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.eql([[1, 2, 3], 'property'])
  })
})
