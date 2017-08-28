/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./background.d.ts'/>
/// <reference path='./contentscript.d.ts'/>

// @NOTE: contentscript should not use same dependency with tracker
// the only connection of these two are native HTML DOM API

import * as fs from 'fs'

import ActionStore from './tracker/ActionStore'
import TrackIDFactory from './tracker/TrackIDFactory'
import MessageType from './tracker/types/MessageType'
// @NOTE: use utils for test purpose, karma will put tracker
// and contentscript into same window, which causes tracker to
// track HTML DOM API in contentscript. In real environment,
// tracker and contentscript are in different window
import { attachListenerTo } from './tracker/NativeUtils'

let selected: Element
let selectedID: TrackID

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
  attachListenerTo(window, 'js-tracker', async (event: CustomEvent) => {
    const info: ActionInfo = event.detail.info

    const shouldUpdateDevtool =
      await store.registerFromActionInfo(info)

    if (shouldUpdateDevtool) {
      const type =
        isSelectedFirstUpdated(selectedID, info.trackid)
          ? MessageType.DevtoolForceUpdate
          : MessageType.ActionStoreUpdated

      devtoolShouldUpdate(
        type,
        info.trackid,
        store.get(info.trackid)
      )
    }
  })
}

function isSelectedFirstUpdated(oldID: TrackID, newID: TrackID) {
  const curID = getTrackIDFrom(selected)

  return curID === newID && curID !== selectedID
}

function listenOnDevtoolSelectionChanged() {
  window.onDevtoolSelectionChanged = (element: Element) => {
    const trackid = selectedID = getTrackIDFrom(selected = element)

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

function getTrackIDFrom(element: Element) {
  const trackid =
    element instanceof Element
      ? element.getAttribute('trackid') : null
  return trackid || TrackIDFactory.generateNullID()
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