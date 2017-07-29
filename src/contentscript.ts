/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./contentscript.d.ts'/>

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'

const actionStore = new ActionStore()

listenOnActionTriggered()
listenOnDevtoolsSelectionChanged()
injectTrackerScript()

function listenOnActionTriggered() {
  window.addEventListener('message', (event) => {
    actionStore.registerFromActionInfo(<ActionInfo>event.data)
  })
}

function listenOnDevtoolsSelectionChanged() {
  window.onDevtoolsSelectionChanged = (owner: Owner) => {
    const record = actionStore.get(owner.dataset._trackid)

    chrome.runtime.sendMessage(record, (response) => {
      console.group('contentscript')
      console.log('--- forward record to background ---')
      console.log('target:', owner)
      console.log('sent:', record)
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