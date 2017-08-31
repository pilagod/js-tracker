/// <reference path='../../node_modules/@types/chrome/index.d.ts' />
/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='./background.d.ts'/>
/// <reference path='./contentscript.d.ts'/>

// @NOTE: contentscript should not use same dependency with tracker
// the only connection of these two are native HTML DOM API

import * as fs from 'fs'

import ActionStore from '../tracker/public/ActionStore'
import TrackIDFactory from '../tracker/public/TrackIDFactory'

let selection: Element

const state = {
  SELECTION_IS_CHANGED: true,
  SELECTION_IS_NOT_CHANGED: false
}
const store = new ActionStore()

listenOnActionTriggered()
listenOnDevtoolSelectionChanged()
try {
  // in production environment
  injectTrackerScript()
} catch (e) {
  // in testing environment
}

function listenOnActionTriggered() {
  window.addEventListener('js-tracker', async (event: CustomEvent) => {
    const info: ActionInfo = event.detail.info
    const success = await store.registerFromActionInfo(info)

    if (success && isSelectionUpdated(info.trackid)) {
      devtoolShouldUpdate(
        store.get(info.trackid),
        state.SELECTION_IS_NOT_CHANGED
      )
    }
  })
}

function isSelectionUpdated(updatedID: TrackID) {
  return getTrackIDFrom(selection) === updatedID
}

function devtoolShouldUpdate(records: ActionRecord[], selectionChanged: boolean): void {
  const message: Message = { records, selectionChanged }

  chrome.runtime.sendMessage(message, (response) => {
    console.group('contentscript')
    console.log('--- Devtool Should Update ---')
    console.log('sent:', message)
    console.log('received:', response)
    console.log('-----------------------------')
    console.groupEnd()
  })
}

function listenOnDevtoolSelectionChanged() {
  window.onDevtoolSelectionChanged = (element: Element) => {
    console.group('contentscript')
    console.log('--- On Devtool Selection Changed ---')
    console.log('selected:', element)
    console.log('------------------------------------')
    console.groupEnd()

    const trackid = getTrackIDFrom(selection = element)

    devtoolShouldUpdate(
      store.get(trackid),
      state.SELECTION_IS_CHANGED
    )
  }
}

function getTrackIDFrom(element: Element) {
  const trackid =
    element instanceof Element
      ? element.getAttribute('trackid') : null
  return trackid || TrackIDFactory.generateNullID()
}

function injectTrackerScript() {
  const script = document.createElement('script')

  script.textContent = fs.readFileSync(__dirname + '/../../dist/tracker.js', 'utf-8')

  document.documentElement.appendChild(script)
  document.documentElement.removeChild(script)

  // issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
  // script.src = chrome.extension.getURL('dist/injectscript.js')
  // script.async = false
}