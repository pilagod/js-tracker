// spec: https://github.com/estree/estree/blob/master/spec.md#returnstatement

describe('ReturnStatement tests', () => {
  let returnStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    returnStatement = createAstNode('ReturnStatement', {
      argument: createAstNode('Expression')
    })

    sandbox.stub(esprimaParser, 'flowState', {
      set: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'parseReturnArgument')
  })

  it('should call parseReturnArgument with argument', () => {
    esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.parseReturnArgument
        .calledWithExactly(returnStatement.argument)
    ).to.be.true
  })

  it('should set flowState to FlowState.RETURN after parseReturnArgument', () => {
    esprimaParser.ReturnStatement(returnStatement)

    expect(
      esprimaParser.flowState.set
        .calledWithExactly(FlowState.RETURN)
    ).to.be.true
    expect(
      esprimaParser.flowState.set
        .calledAfter(esprimaParser.parseReturnArgument)
    ).to.be.true
  })

  it('should return result from parseReturnArgument', () => {
    esprimaParser.parseReturnArgument.returns('resultFromParseReturnArgument')

    const result = esprimaParser.ReturnStatement(returnStatement)

    expect(result).to.be.equal('resultFromParseReturnArgument')
  })
})
