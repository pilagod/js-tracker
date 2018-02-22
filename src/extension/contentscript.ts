/// <reference path='../../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./private/types/ContentscriptHelpers.d.ts'/>

import * as fs from 'fs'

import { RECORD_STORE_ADD } from './public/RecordStoreActions'
import ActionRecordStore from './private/ActionRecordStore'
import initContentscriptHelpers from './contentscriptHelpers'
import { isTestEnv } from './utils'

function main(helpers: ContentscriptHelpers) {
  listenToRecordStoreAddMessage(helpers.recordStoreAddMessageHandler)
  listenToDevtoolSelectionChanged(helpers.devtoolSelectionChangedHandler)
  injectTrackerScript(helpers.injectScript)
}

function listenToRecordStoreAddMessage(
  recordStoreAddMessageHandler: (message: RecordStoreAddMessage) => void
) {
  window.addEventListener(RECORD_STORE_ADD, (event: CustomEvent) => {
    recordStoreAddMessageHandler(event.detail.message)
  })
}

function listenToDevtoolSelectionChanged(devtoolSelectionChangedHandler: (element: Element) => void) {
  window.onDevtoolSelectionChanged = devtoolSelectionChangedHandler
}

function injectTrackerScript(injectScript: (container: Node, scriptText: string) => void) {
  // issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
  // script.src = chrome.extension.getURL('dist/injectscript.js')
  // script.async = false
  injectScript(
    document.documentElement,
    fs.readFileSync(__dirname + '/../../dist/tracker.js', 'utf-8')
  )
}

if (!isTestEnv()) {
  main(initContentscriptHelpers(new ActionRecordStore(), chrome.runtime.sendMessage))
}
export default main

