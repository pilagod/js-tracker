/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import ActionType from '../src/tracker/public/ActionType'
import {
  createActionRecord
} from './utils'

// all actions refer to ./script.js
const scriptUrl = '/script.js'

export default [
  // action[0] `div.id = 'id'`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Attr,
      loc: {
        scriptUrl,
        lineNumber: 2,
        columnNumber: 1
      }
    },
    record: createActionRecord(
      ActionType.Attr,
      scriptUrl, 2, 1,
      `div.id = 'id'`
    )
  },
  // action[1] `div.style.color = 'red'`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Style,
      loc: {
        scriptUrl,
        lineNumber: 3,
        columnNumber: 1
      }
    },
    record: createActionRecord(
      ActionType.Style,
      scriptUrl, 3, 1,
      `div.style.color = 'red'`
    ),
  },
  // action[2] `div.removeAttribute('style')`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Style,
      loc: {
        scriptUrl,
        lineNumber: 4,
        columnNumber: 1
      }
    },
    record: createActionRecord(
      ActionType.Style,
      scriptUrl, 4, 1,
      `div.removeAttribute('style')`
    )
  },
  // action[3] `div.innerText = 'js-tracker'`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Attr | ActionType.Node,
      loc: {
        scriptUrl,
        lineNumber: 5,
        columnNumber: 1
      }
    },
    record: createActionRecord(
      ActionType.Attr | ActionType.Node,
      scriptUrl, 5, 1,
      `div.innerText = 'js-tracker'`
    )
  },
  // action[4] `div.addEventListener('click', function () {console.log('clicked')})`
  {
    info: <ActionInfo>{
      trackid: '1',
      type: ActionType.Event,
      loc: {
        scriptUrl,
        lineNumber: 6,
        columnNumber: 5
      }
    },
    record: createActionRecord(
      ActionType.Event,
      scriptUrl, 6, 5,
      `div.addEventListener('click', function () {console.log('clicked')})`
    )
  }
]