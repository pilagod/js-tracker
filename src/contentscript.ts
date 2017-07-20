/// <reference path='../node_modules/@types/chrome/index.d.ts' />

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'

const actionStore = new ActionStore()

listenOnActionTriggered()
listenOnDevtoolsSelectionChanged()
injectTrackerScript()

function listenOnActionTriggered() {
  window.addEventListener('message', (event) => {
    const actionInfo = <ActionInfo>event.data

    actionStore.registerFromActionInfo(actionInfo)
  })
}

function listenOnDevtoolsSelectionChanged() {
  window.onDevtoolsSelectionChanged = (owner: Owner) => {
    const actionRecord = actionStore.get(owner._trackid)

    chrome.runtime.sendMessage(actionRecord, (res) => {
      console.group('from contentscript to background')
      console.log('target:', owner)
      console.log('sent:', actionRecord)
      console.log('received:', res)
      console.groupEnd()
    })
  }
}

function injectTrackerScript() {
  const script = document.createElement('script')
  // issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
  script.textContent = fs.readFileSync(__dirname + '/../dist/injectscript.js', 'utf-8')
  // script.src = chrome.extension.getURL('dist/injectscript.js')
  // script.async = false
  document.documentElement.appendChild(script)
}