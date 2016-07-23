// it('should not call handleCatchClause and throw error got from block given null handler', () => {
//   tryStatement.handler = null
//
//   esprimaParser.parseNode
//     .withArgs(tryStatement.block)
//       .throws(error)
//
//   try {
//     esprimaParser.TryStatement(tryStatement)
//   } catch (e) {
//     expect(e).to.be.eql(error)
//   }
//   expect(esprimaParser.handleCatchClause.called).to.be.false
// })
