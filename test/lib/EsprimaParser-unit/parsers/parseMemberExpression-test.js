describe('parseMemberExpression tests', () => {
  let memberExpression

  const setGetObjectAsExpressionArrayReturn = (expressionArray) => {
    if (esprimaParser.getObjectAsExpressionArray.restore) {
      esprimaParser.getObjectAsExpressionArray.restore()
    }
    sandbox.stub(esprimaParser, 'getObjectAsExpressionArray')
      .returns(expressionArray)
  }

  beforeEach(() => {
    memberExpression = createAstNode('memberExpression', {
      object: createAstNode('Expression'),
      property: createAstNode('Expression'),
      computed: 'boolean'
    })

    setGetObjectAsExpressionArrayReturn(['object'])
    sandbox.stub(esprimaParser, 'getPropertyKey')
      .returns('property')
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
      esprimaParser.getPropertyKey
        .calledWithExactly(
          memberExpression.property,
          memberExpression.computed
        )
    ).to.be.true
  })

  it('should return [\'object\', \'property\'] given getObjectAsExpressionArray returns [\'object\']', () => {
    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['object', 'property'])
  })

  it('should return [\'object1\', \'object2\', \'property\'] given getObjectAsExpressionArray returns [\'object1\', \'object2\']', () => {
    setGetObjectAsExpressionArrayReturn(['object1', 'object2'])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['object1', 'object2', 'property'])
  })

  it('should return [[1, 2, 3], \'property\'] given getObjectAsExpressionArray returns [[1, 2, 3]]', () => {
    setGetObjectAsExpressionArrayReturn([[1, 2, 3]])

    const result = esprimaParser.parseMemberExpression(memberExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql([[1, 2, 3], 'property'])
  })
})
