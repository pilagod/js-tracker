describe('parseCallee tests', () => {
  let callee
  // stub results
  const exp = {
    caller: {caller: 'caller'},
    callee: {callee: 'callee'}
  }
  const calleeInstance = {}

  beforeEach(() => {
    callee = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'getCallExpFromCallee').returns(exp)
    sandbox.stub(esprimaParser, 'createCallee').returns(calleeInstance)
  })

  it('should call getCallExpFromCallee with callee', () => {
    esprimaParser.parseCallee(callee)

    expect(
      esprimaParser.getCallExpFromCallee
        .calledWithExactly(callee)
    ).to.be.true
  })

  it('should return an object containing caller of exp.caller and callee of result from createCallee called with exp.callee', () => {
    const result = esprimaParser.parseCallee(callee)

    expect(
      esprimaParser.createCallee
        .calledWithExactly(exp.callee)
    ).to.be.true
    expect(result).to.be.eql({
      caller: exp.caller,
      callee: calleeInstance
    })
  })

  // let callee
  //
  // it('should call parseMemberCallee with callee and return given callee is MemberExpression', () => {
  //   callee = createAstNode('MemberExpression')
  //
  //   sandbox.stub(esprimaParser, 'parseMemberCallee')
  //     .returns('resultFromParseMemberCallee')
  //
  //   const result = esprimaParser.parseCallee(callee)
  //
  //   expect(
  //     esprimaParser.parseMemberCallee
  //       .calledWithExactly(callee)
  //   ).to.be.true
  //   expect(result).to.be.equal('resultFromParseMemberCallee')
  // })
  //
  // it('should call parseOtherCallee with callee and return given callee is not MemberExpression', () => {
  //   callee = createAstNode('OtherExpression')
  //
  //   sandbox.stub(esprimaParser, 'parseOtherCallee')
  //     .returns('resultFromParseOtherCallee')
  //
  //   const result = esprimaParser.parseCallee(callee)
  //
  //   expect(
  //     esprimaParser.parseOtherCallee
  //       .calledWithExactly(callee)
  //   ).to.be.true
  //   expect(result).to.be.equal('resultFromParseOtherCallee')
  // })

  // let calleeExpression
  //
  // describe('calleeExpression is MemberExpression', () => {
  //   beforeEach(() => {
  //     calleeExpression = createAstNode('MemberExpression')
  //
  //     sandbox.stub(esprimaParser, 'parseMemberCallee')
  //       .returns('resultFromParseMemberCallee')
  //   })
  //
  //   it('should call parseMemberCallee with calleeExpression', () => {
  //     esprimaParser.parseCallee(calleeExpression)
  //
  //     expect(
  //       esprimaParser.parseMemberCallee
  //         .calledWithExactly(calleeExpression)
  //     ).to.be.true
  //   })
  //
  //   it('should return result from parseMemberCallee', () => {
  //     const result = esprimaParser.parseCallee(calleeExpression)
  //
  //     expect(result).to.be.equal('resultFromParseMemberCallee')
  //   })
  // })
  //
  // describe('calleeExpression other than MemberExpression', () => {
  //   beforeEach(() => {
  //     calleeExpression = createAstNode('Expression')
  //
  //     sandbox.stub(esprimaParser, 'parseOtherCallee')
  //       .returns('resultFromParseOtherCallee')
  //   })
  //
  //   it('should call parseOtherCallee with calleeExpression', () => {
  //     esprimaParser.parseCallee(calleeExpression)
  //
  //     expect(
  //       esprimaParser.parseOtherCallee
  //         .calledWithExactly(calleeExpression)
  //     ).to.be.true
  //   })
  //
  //   it('should return result from parseOtherCallee', () => {
  //     const result = esprimaParser.parseCallee(calleeExpression)
  //
  //     expect(result).to.be.equal('resultFromParseOtherCallee')
  //   })
  // })
})
