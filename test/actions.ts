/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import ActionType from '../src/tracker/public/ActionType'
import { hash } from '../src/tracker/public/utils'

function createAction(
  trackid: TrackID,
  type: ActionType,
  scriptUrl: string,
  lineNumber: number,
  columnNumber: number,
  code: string,
) {
  const loc = { scriptUrl, lineNumber, columnNumber }

  return {
    info: <ActionInfo>{ trackid, type, loc },
    record: <ActionRecord>{
      key: hash(`${scriptUrl}:${lineNumber}:${columnNumber}`),
      type, loc, code
    }
  }
}
// actions in js
const actionsOfJS = ((urlOfJS) => [
  // action[0] `div.id = 'id'`
  createAction('1', ActionType.Attr, urlOfJS, 2, 8, `div.id = 'id'`),
  // action[1] `div.style.color = 'red'`
  createAction('1', ActionType.Style, urlOfJS, 3, 17, `div.style.color = 'red'`),
  // action[2] `div.removeAttribute('style')`
  createAction('1', ActionType.Style, urlOfJS, 4, 5, `div.removeAttribute('style')`),
  // action[3] `div.innerText = 'js-tracker'`
  createAction('1', ActionType.Attr | ActionType.Node, urlOfJS, 5, 15, `div.innerText = 'js-tracker'`),
  // action[4] `div.addEventListener('click', function () {console.log('clicked')})`
  createAction('1', ActionType.Event, urlOfJS, 6, 5, `div.addEventListener('click', function () { ... })`),
  // action[5] `div.classList.add('class' + i)`
  createAction('1', ActionType.Style, urlOfJS, 10, 17, `div.classList.add('class' + i)`),
])(`/script.js`)

// actions in html
const actionsOfHTML = ((urlOfHTML) => [
  // action[0] `div.innerText = 'js-tracker'`
  createAction('1', ActionType.Attr | ActionType.Node, urlOfHTML, 21, 23, `div.innerText = 'js-tracker'`),
  // action[1] `div.addEventListener('click', function () {console.log('clicked')})`
  createAction('1', ActionType.Event, urlOfHTML, 26, 13, `div.addEventListener('click', function () { ... })`)
])(`/script.html`)

export { actionsOfJS, actionsOfHTML }