/// <reference path='../../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./contentscript.d.ts'/>

import * as fs from 'fs'

import ActionStore from '../tracker/public/ActionStore'

import initContentscriptHelpers from './contentscriptHelpers'
import { isTestEnv } from '../utils'

function main(
  helpers: {
    actionHandler: (info: ActionInfo) => void,
    devtoolSelectionChangedHandler: (element: Element) => void,
    injectScript: (container: Node, scriptText: string) => void
  }
) {
  listenToAction(helpers.actionHandler)
  listenToDevtoolSelectionChanged(helpers.devtoolSelectionChangedHandler)
  injectTrackerScript(helpers.injectScript)
}

function listenToAction(actionHandler: (info: ActionInfo) => void) {
  window.addEventListener('js-tracker', (event: CustomEvent) => {
    actionHandler(<ActionInfo>event.detail.info)
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
  main(initContentscriptHelpers(new ActionStore(), chrome.runtime.sendMessage))
}
export default isTestEnv() ? main : null

