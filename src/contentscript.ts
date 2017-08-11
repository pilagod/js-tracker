/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./background.d.ts'/>
/// <reference path='./contentscript.d.ts'/>

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'
import OwnerManager from './tracker/OwnerManager'

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
  window.addEventListener('message', async (event) => {
    await store.registerFromActionInfo(event.data as ActionInfo)
  })
}

function listenOnDevtoolSelectionChanged() {
  window.onDevtoolSelectionChanged = (element: Element) => {
    const trackid = OwnerManager.getTrackIDFromOwnerOf(element)
    const message: Message = {
      trackid: trackid,
      records: store.get(trackid)
    }
    chrome.runtime.sendMessage(message, (response) => {
      console.group('contentscript')
      console.log('--- forward record to background ---')
      console.log('target:', element)
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