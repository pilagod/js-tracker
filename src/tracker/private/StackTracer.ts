/// <reference path='../public/ActionStore.d.ts'/>

import * as StackTrace from 'stacktrace-js'

class StackTracer {
  // @NOTE: 
  //  StackTracer (0) 
  //  -> record (1) 
  //  -> DOM API function (2)
  //  -> code calling DOM API (3)
  static HTML_DOM_API_INDEX = 3

  /* public */

  public getSourceLocation(): SourceLocation {
    const stackframe = this.getSourceStackFrame(StackTrace.getSync())

    return {
      scriptUrl: stackframe.fileName,
      lineNumber: stackframe.lineNumber,
      columnNumber: stackframe.columnNumber
    }
  }

  /* private */

  private trackedAPIs: Array<(stackframe: StackTrace.StackFrame) => boolean> = [
    function _(stackframe) {
      return false
    }
  ]

  private getSourceStackFrame(stackframes: StackTrace.StackFrame[]): StackTrace.StackFrame {
    const trimmedStackFrames = stackframes.slice(StackTracer.HTML_DOM_API_INDEX + 1)

    return trimmedStackFrames.reduceRight((result, stackframe) => {
      return result || this.takeThisAsSourceStackFrameOrNot(stackframe)
    }, null) || stackframes[StackTracer.HTML_DOM_API_INDEX]
  }

  private takeThisAsSourceStackFrameOrNot(stackframe: StackTrace.StackFrame): StackTrace.StackFrame | null {
    if (!stackframe.functionName) {
      return null
    }
    for (const isTrackedAPI of this.trackedAPIs) {
      if (isTrackedAPI(stackframe)) {
        return stackframe
      }
    }
    return null
  }
}
export default new StackTracer()