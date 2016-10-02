// spec: https://github.com/estree/estree/blob/master/es5.md#labeledstatement

describe('LabeledStatement tests', () => {
  const label = 'label'
  let labeledStatement

  beforeEach(() => {
    labeledStatement = createAstNode('LabeledStatement', {
      label: createAstNode('Identifier'),
      body: createAstNode('Statement')
    })
    sandbox.stub(esprimaParser, 'getNameFromPattern').returns(label)
    sandbox.stub(esprimaParser, 'parseNode').returns('resultFromParseNode')
  })

  it('should call getNameFromPattern with label', () => {
    esprimaParser.LabeledStatement(labeledStatement)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(labeledStatement.label)
    ).to.be.true
  })

  it('should return result from parseNode called with body and an object containing label with result from getNameFromPattern', () => {
    const result = esprimaParser.LabeledStatement(labeledStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(labeledStatement.body, {label})
    ).to.be.true
    expect(result).to.be.equal('resultFromParseNode')
  })
})
