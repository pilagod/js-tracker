/// <reference path='../node_modules/@types/chrome/index.d.ts' />

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'

const actionStore = new ActionStore()

window.addEventListener('message', (event) => {
  console.log(event.data)
  // actionStore.registerFromActionInfo(<ActionInfo>event.data)
})

console.log('content script loaded')
console.log(document.querySelectorAll('script').length)

const script = document.createElement('script')
script.textContent = fs.readFileSync(__dirname + '/src/injectscript.ts', 'utf-8')
// script.src = chrome.extension.getURL('dist/injectscript.js')
// script.async = false
document.documentElement.appendChild(script)