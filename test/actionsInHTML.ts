/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import ActionType from '../src/tracker/public/ActionType'
import {
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
      loc: {
        scriptUrl,
        lineNumber: 20,
        columnNumber: 13
      },
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
      loc: {
        scriptUrl,
        lineNumber: 24,
        columnNumber: 13
      },
    },
    record: createActionRecord(
      ActionType.Event,
      scriptUrl, 24, 13,
      `div.addEventListener('click', function () {console.log('clicked')})`
    )
  }
]