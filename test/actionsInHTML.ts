/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import ActionType from '../src/tracker/public/ActionType'
import {
  createActionRecord
} from './utils'

// all actions refer to ./script.html
const scriptUrl = '/script.html'

export default [
  // action[0] `div.innerText = 'js-tracker'`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Attr | ActionType.Node,
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
  // action[1] `div.addEventListener('click', function () {console.log('clicked')})`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Event,
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