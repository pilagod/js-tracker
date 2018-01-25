/// <reference path='../public/ActionStore.d.ts'/>

import * as StackTrace from 'stacktrace-js'
import checkers from './checkers'

class StackTracer {
  // @NOTE: StackTracer (0) 
  //  -> record (1) 
  //  -> DOM API function (2)
  //  -> code calling DOM API (3)
  static HTML_DOM_API_INDEX = 3

  private checkers: Array<(stackframe: StackTrace.StackFrame) => boolean>

  constructor(checkers) {
    this.checkers = checkers
  }

  /* public */

  public getSourceLocation(): SourceLocation {
    const stackframes = StackTrace.getSync()
    const stackframe = this.getSourceStackFrame(stackframes)
    // @TODO: callback function will break stack trace
    // stackframes.map((stackframe) => {
    //   console.log(stackframe)
    //   console.log()
    // })
    // console.log(stackframe)
    return {
      scriptUrl: stackframe.fileName,
      lineNumber: stackframe.lineNumber,
      columnNumber: stackframe.columnNumber
    }
  }

  /* private */

  private getSourceStackFrame(stackframes: StackTrace.StackFrame[]): StackTrace.StackFrame {
    // @NOTE: index of StackTracer.HTML_DOM_API_INDEX refers to which function invoking html dom api,
    // and the location in that function actually invoking this html dom api
    const trimmedStackFrames = stackframes.slice(StackTracer.HTML_DOM_API_INDEX)

    return trimmedStackFrames.reduceRight((result, stackframe, index, stackframes) => {
      // @NOTE: Suppose we found tracked api called at stackframe i
      // the location of the code invoking the tracked api is at stackframe i + 1 
      return result || (this.isStackFrameAboutTrackedAPI(stackframe) ? stackframes[index + 1] : null)
    }, null) || stackframes[StackTracer.HTML_DOM_API_INDEX]
  }

  private isStackFrameAboutTrackedAPI(stackframe: StackTrace.StackFrame): boolean {
    if (!stackframe.functionName) {
      return false
    }
    for (const check of this.checkers) {
      if (check(stackframe)) {
        return true
      }
    }
    return false
  }
}
export default new StackTracer(checkers)