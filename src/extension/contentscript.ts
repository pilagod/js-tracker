/// <reference path='../../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./contentscript.d.ts'/>

import * as fs from 'fs'

import ActionStore from '../tracker/public/ActionStore'
import initContentscriptHelpers from './contentscriptHelpers'

let helpers

function main() {
  initHelpers()
  listenOnAction()
  listenOnDevtoolSelectionChanged()
  injectTrackerScript()
}

function initHelpers() {
  helpers = initContentscriptHelpers(
    new ActionStore(),
    chrome.runtime.sendMessage
  )
}

function listenOnAction() {
  window.addEventListener('js-tracker', (event: CustomEvent) => {
    helpers.actionHandler(<ActionInfo>event.detail.info)
  })
}

function listenOnDevtoolSelectionChanged() {
  window.onDevtoolSelectionChanged = helpers.devtoolSelectionChangedHandler
}

function injectTrackerScript() {
  // issue: [https://stackoverflow.com/questions/15730869/my-injected-script-runs-after-the-target-pages-javascript-despite-using-run]
  // script.src = chrome.extension.getURL('dist/injectscript.js')
  // script.async = false
  helpers.injectScript(
    document.documentElement,
    fs.readFileSync(__dirname + '/../../dist/tracker.js', 'utf-8')
  )
}
main()