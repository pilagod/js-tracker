/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./background.d.ts'/>
/// <reference path='./contentscript.d.ts'/>

// @NOTE: contentscript should not use same dependency with tracker
// the only connection of these two are native HTML DOM API

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'
import MessageType from './MessageType'
import { Track_ID_Does_Not_Exist } from './tracker/TrackIDManager'

const store = new ActionStore(devtoolShouldUpdate)

listenOnActionTriggered()
listenOnDevtoolSelectionChanged()
try {
  // in production environment
  injectTrackerScript()
} catch (e) {
  // in testing environment
}

function listenOnActionTriggered() {
  window.addEventListener('message', async (event) => {
    await store.registerFromActionInfo(event.data as ActionInfo)
  })
}

function listenOnDevtoolSelectionChanged() {
  window.onDevtoolSelectionChanged = (element: Element) => {
    const trackid = getTrackIDFromElement(element)

    console.group('contentscript')
    console.log('--- On Devtool Selection Changed ---')
    console.log('selected:', element)
    console.log('------------------------------------')
    console.groupEnd()

    devtoolShouldUpdate(
      MessageType.DevtoolSelectionChanged,
      trackid,
      store.get(trackid)
    )
  }
}

function devtoolShouldUpdate(
  type: MessageType,
  trackid: TrackID,
  records: ActionRecord[]
): void {
  const message: Message = { type, trackid, records }

  chrome.runtime.sendMessage(message, (response) => {
    console.group('contentscript')
    console.log('--- Devtool Should Update ---')
    console.log('sent:', message)
    console.log('received:', response)
    console.log('-----------------------------')
    console.groupEnd()
  })
}

function getTrackIDFromElement(element: Element) {
  const trackid =
    element instanceof Element
      ? element.getAttribute('trackid')
      : null
  return trackid || Track_ID_Does_Not_Exist
}

function injectTrackerScript() {
  const script = document.createElement('script')

  script.textContent = fs.readFileSync(__dirname + '/../dist/tracker.js', 'utf-8')

  document.documentElement.appendChild(script)
  document.documentElement.removeChild(script)

  // issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
  // script.src = chrome.extension.getURL('dist/injectscript.js')
  // script.async = false
}