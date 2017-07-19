/// <reference path='../node_modules/@types/chrome/index.d.ts' />

import * as fs from 'fs'
import ActionStore from './tracker/ActionStore'

const actionStore = new ActionStore()

window.addEventListener('message', (event) => {
  console.log(event.data)
  // actionStore.registerFromActionInfo(<ActionInfo>event.data)
})

const script = document.createElement('script')
// issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
script.textContent = fs.readFileSync(__dirname + '/../dist/injectscript.js', 'utf-8')
// script.src = chrome.extension.getURL('dist/injectscript.js')
// script.async = false
document.documentElement.appendChild(script)