/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./background.d.ts'/>
/// <reference path='./contentscript.d.ts'/>

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'
import MessageType from './MessageType'

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
    const trackid = owner.dataset._trackid
    const message: Message = {
      type: MessageType.DevtoolSelectionChanged,
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

  script.textContent = fs.readFileSync(__dirname + '/../dist/injectscript.js', 'utf-8')

  document.documentElement.appendChild(script)
  document.documentElement.removeChild(script)

  // issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
  // script.src = chrome.extension.getURL('dist/injectscript.js')
  // script.async = false
}