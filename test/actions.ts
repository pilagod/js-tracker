/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import StackFrame from 'stackframe'
import ActionType from '../src/tracker/public/ActionType'

function createActionRecord(
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
// dummy stack frame
const _: StackTrace.StackFrame = new StackFrame({
  functionName: 'dummy',
  fileName: 'dummy.js',
  lineNumber: 0,
  columnNumber: 0
})
// all actions refer to ./script.js
const scriptUrl = '/script.js'

export default [
  // action[0]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'Element',
      action: 'id',
      stacktrace: [_, _, new StackFrame({
        functionName: 'Element.id',
        fileName: scriptUrl,
        lineNumber: 2,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Attr,
      scriptUrl, 2, 1,
      `div.id = 'id'`
    )
  },
  // action[1]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'CSSStyleDeclaration',
      action: 'color',
      stacktrace: [_, _, new StackFrame({
        functionName: 'Object.set',
        fileName: scriptUrl,
        lineNumber: 3,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Style,
      scriptUrl, 3, 1,
      `div.style.color = 'red'`
    ),
  },
  // action[2]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'Element',
      action: 'removeAttribute',
      actionTag: 'style',
      stacktrace: [_, _, new StackFrame({
        functionName: 'Element.removeAttribute',
        fileName: scriptUrl,
        lineNumber: 4,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Style,
      scriptUrl, 4, 1,
      `div.removeAttribute('style')`
    )
  },
  // action[3]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'HTMLElement',
      action: 'innerText',
      stacktrace: [_, _, new StackFrame({
        functionName: 'HTMLElement.innerText',
        fileName: scriptUrl,
        lineNumber: 5,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Attr | ActionType.Node,
      scriptUrl, 5, 1,
      `div.innerText = 'js-tracker'`
    )
  }
]