import StackFrame from 'stackframe'

// dummy stack frame
export const dummyStackFrame = new StackFrame({
  functionName: 'dummy',
  fileName: 'dummy.js',
  lineNumber: 0,
  columnNumber: 0
})

export function createActionRecord(
  type: ActionType,
  scriptUrl: string,
  lineNumber: number,
  columnNumber: number,
  code: string,
): ActionRecord {
  return {
    key: `${scriptUrl}:${lineNumber}:${columnNumber}`,
    type: type,
    source: {
      loc: { scriptUrl, lineNumber, columnNumber },
      code: code
    }
  }
}