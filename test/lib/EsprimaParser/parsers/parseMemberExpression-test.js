describe('parseMemberExpression tests', () => {
  let memberExpression

  beforeEach(() => {
    memberExpression = createAstNode('memberExpression', {
      object: createAstNode('Literal', {value: 'object'}),
      property: createAstNode('Literal', {value: 'property'}),
      computed: 'computed'
    })

    sandbox.stub(esprimaParser, 'getObjectAsExpressionArray', sandbox.spy(createLiteralStub()))
    sandbox.stub(esprimaParser, 'getPropertyAsString', sandbox.spy(createLiteralStub()))
  })

  it('should call getObjectAsExpressionArray with member object', () => {
    esprimaParser.parseMemberExpression(memberExpression)

    expect(
      esprimaParser.getObjectAsExpressionArray
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

  const setGetObjectAsExpressionArrayReturnValue = (value) => {
    esprimaParser.getObjectAsExpressionArray.restore()
    sandbox.stub(esprimaParser, 'getObjectAsExpressionArray').returns(value)
  }

  it('should return [\'object\', \'property\'] given getObjectAsExpressionArray returns [\'object\']', () => {
    setGetObjectAsExpressionArrayReturnValue(['object'])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['object', 'property'])
  })

  it('should return [\'object1\', \'object2\', \'property\'] given getObjectAsExpressionArray returns [\'object1\', \'object2\']', () => {
    setGetObjectAsExpressionArrayReturnValue(['object1', 'object2'])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['object1', 'object2', 'property'])
  })

  it('should return [[1, 2, 3], \'property\'] given getObjectAsExpressionArray returns [[1, 2, 3]]', () => {
    setGetObjectAsExpressionArrayReturnValue([[1, 2, 3]])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql([[1, 2, 3], 'property'])
  })
})
