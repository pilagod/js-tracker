/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./background.d.ts'/>
/// <reference path='./contentscript.d.ts'/>

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'

const store = new ActionStore()

listenOnActionTriggered()
listenOnDevtoolSelectionChanged()
injectTrackerScript()

function listenOnActionTriggered() {
  window.addEventListener('message', (event) => {
    store.registerFromActionInfo(<ActionInfo>event.data)
  })
}

function listenOnDevtoolSelectionChanged() {
  window.onDevtoolSelectionChanged = (owner: Owner) => {
    // @TODO: a better way to organize trackid status
    // between contentscript and devtool
    const trackid = owner.dataset._trackid || 'TRACK_ID_NOT_EXIST'
    const message: Message = {
      trackid: trackid,
      records: store.get(trackid)
    }
    chrome.runtime.sendMessage(message, (response) => {
      console.group('contentscript')
      console.log('--- forward record to background ---')
      console.log('target:', owner)
      console.log('sent:', message)
      console.log('received:', response)
      console.log('------------------------------------')
      console.groupEnd()
    })
  }
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