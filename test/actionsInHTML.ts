/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import StackFrame from 'stackframe'
import ActionType from '../src/tracker/public/ActionType'
import {
  dummyStackFrame as _,
  createActionRecord
} from './utils'

// all actions refer to ./script.html
const scriptUrl = '/script.html'

export default [
  // action[0]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'HTMLElement',
      action: 'innerText',
      stacktrace: [_, _, new StackFrame({
        functionName: 'HTMLElement.innerText',
        fileName: scriptUrl,
        lineNumber: 20,
        columnNumber: 13
      })]
    },
    record: createActionRecord(
      ActionType.Attr | ActionType.Node,
      scriptUrl, 20, 13,
      `div.innerText = 'js-tracker'`
    )
  },
  // action[1]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'EventTarget',
      action: 'addEventListener',
      stacktrace: [_, _, new StackFrame({
        functionName: 'EventTarget.addEventListener',
        fileName: scriptUrl,
        lineNumber: 24,
        columnNumber: 13
      })]
    },
    record: createActionRecord(
      ActionType.Event,
      scriptUrl, 24, 13,
      `div.addEventListener('click', function () {console.log('clicked')})`
    )
  }
]