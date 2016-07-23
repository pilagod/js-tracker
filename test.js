function test (count) {
  console.log(count);
  return count < 10
}

let count = 1

do {
  continue
} while (test(count++))

// const setCheckStatusResults = (method, results) => {
//   esprimaParser.status[method] =
//     sandbox.spy(createResultsGenerator(results))
// }

WhileStatement(whileStatement) {
  let result, status

  while (this.parseNode(whileStatement.test)) {
    result = this.parseNode(whileStatement.body)
    status = this.getLoopStatusAndReset()

    if (status === 'break') {
      break
    }
  }

  // while (this.parseNode(whileStatement.test)) {
  //   result = this.parseNode(whileStatement.body)
  //
  //   if (this.status.isLoopBreakStatus()) {
  //     this.status.unset('break')
  //     break
  //   } else if (this.status.isLoopContinueStatus()) {
  //     this.status.unset('continue')
  //   }
  // }

  // it('should call isLoopBreakStatus of esprimaParser status after parsing body each time test passes', () => {
  //   let i = 0
  //
  //   setCheckStatusResults('isLoopBreakStatus', [false, false, false])
  //
  //   esprimaParser.ForInStatement(forInStatement)
  //
  //   while (i < rightStubLength) {
  //     expect(
  //       esprimaParser.status.isLoopBreakStatus
  //         .getCall(i)
  //         .calledAfter(
  //           esprimaParser.parseNode
  //             .withArgs(forInStatement.body)
  //             .getCall(i)
  //         )
  //     ).to.be.true
  //
  //     i += 1
  //   }
  //   expect(esprimaParser.status.isLoopBreakStatus.calledThrice).to.be.true
  // })
  //
  // it('should call isLoopContinueStatus of esprimaParser status after parsing body each time test passes', () => {
  //   let i = 0
  //
  //   setCheckStatusResults('isLoopContinueStatus', [false, false, false])
  //
  //   esprimaParser.ForInStatement(forInStatement)
  //
  //   while (i < rightStubLength) {
  //     expect(
  //       esprimaParser.status.isLoopContinueStatus
  //         .getCall(i)
  //         .calledAfter(
  //           esprimaParser.parseNode
  //             .withArgs(forInStatement.body)
  //             .getCall(i)
  //         )
  //     ).to.be.true
  //
  //     i += 1
  //   }
  //   expect(esprimaParser.status.isLoopContinueStatus.calledThrice).to.be.true
  // })
  //
  // it('should break the loop and unset break status given isLoopBreakStatus returns true', () => {
  //   setCheckStatusResults('isLoopBreakStatus', [false, true, false])
  //
  //   esprimaParser.ForInStatement(forInStatement)
  //
  //   expect(
  //     esprimaParser.parseNode
  //       .withArgs(forInStatement.body).calledTwice
  //   ).to.be.true
  //   expect(
  //     esprimaParser.status.unset
  //       .calledWithExactly('break')
  //   ).to.be.true
  // })
  //
  // it('should continue the loop and unset continue status given isLoopContinueStatus returns true', () => {
  //   setCheckStatusResults('isLoopContinueStatus', [false, true, false])
  //
  //   esprimaParser.ForInStatement(forInStatement)
  //
  //   expect(
  //     esprimaParser.parseNode
  //       .withArgs(forInStatement.body).calledThrice
  //   ).to.be.true
  //   expect(
  //     esprimaParser.status.unset
  //       .calledWithExactly('continue')
  //   ).to.be.true
  // })

  return result
}
