/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import ActionType from '../src/tracker/public/ActionType'
import {
  createActionRecord
} from './utils'

// all actions refer to ./script.js
const scriptUrl = '/script.js'

export default [
  // action[0]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'Element',
      action: 'id',
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
  // action[1]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'CSSStyleDeclaration',
      action: 'color',
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
  // action[2]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'Element',
      action: 'removeAttribute',
      actionTag: 'style',
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
  // action[3]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'HTMLElement',
      action: 'innerText',
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
  // action[4]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'EventTarget',
      action: 'addEventListener',
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