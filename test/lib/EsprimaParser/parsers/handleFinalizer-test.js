// it('should call parseNode with finalizer given block throws error', () => {
//   esprimaParser.parseNode
//     .withArgs(tryStatement.block)
//       .throws(error)
//
//   esprimaParser.TryStatement(tryStatement)
//
//   expect(
//     esprimaParser.parseNode
//       .withArgs(tryStatement.finalizer).called
//   ).to.be.true
// })
//
// it('should not call parseNode with finalizer given null finalizer', () => {
//   tryStatement.finalizer = null
//
//   esprimaParser.TryStatement(tryStatement)
//
//   expect(
//     esprimaParser.parseNode
//       .withArgs(tryStatement.finalizer).called
//   ).to.be.false
// })
