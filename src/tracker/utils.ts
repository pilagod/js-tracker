import * as StackTrace from 'stacktrace-js'

// should put record here

export function getSourceLocationGivenDepth(depth: number) {
  const stackframe = StackTrace.getSync()[depth]

  return {
    scriptUrl: stackframe.fileName,
    lineNumber: stackframe.lineNumber,
    columnNumber: stackframe.columnNumber,
  }
}