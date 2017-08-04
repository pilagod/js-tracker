/// <reference path='../node_modules/@types/chrome/index.d.ts'/>
/// <reference path='./background.d.ts'/>

import { Null_TrackID } from './tracker/TrackIDManager'
import Sidebar from './Sidebar'

packFilesToDist()

function packFilesToDist() {
  require('file-loader?name=[name].[ext]!./devtool.html')
  require('file-loader?name=sidebar.html!./Sidebar/index.html')
  require('file-loader?name=sidebar.css!./Sidebar/index.css')
}

let state: Message = {
  trackid: Null_TrackID,
  records: []
}
let background
let sidebarWindow

setupConnectionToBackground()
setupJSTrackerSidebar()
updateSidebarOnMessage()
listenOnSelectionChanged()
emitSelectionToContentScript()

function setupConnectionToBackground() {
  const tabID = chrome.devtools.inspectedWindow.tabId.toString()

  background = chrome.runtime.connect({ name: `JS-Tracer Devtool ${tabID}` })
  background.postMessage({ type: 'init', tabID })
}

function setupJSTrackerSidebar() {
  chrome.devtools.panels.elements.createSidebarPane('JS Tracker', (sidebar) => {
    sidebar.setPage('dist/sidebar.html');
    sidebar.onShown.addListener((window) => {
      !sidebarWindow && (sidebarWindow = window)
      renderSidebar()
    })
  })
}

function updateSidebarOnMessage() {
  background.onMessage.addListener((message: Message) => {
    console.group('devtool page')
    console.log('--- message got from background ---')
    console.log('message:', message)
    console.log('state before update:', Object.assign({}, state))

    updateStateBy(message)

    console.log('state after update:', Object.assign({}, state))
    console.log('-----------------------------------')
    console.groupEnd()

    renderSidebar()
  })
}

function updateStateBy(message: Message) {
  state = Object.assign({}, state, message)
}

function renderSidebar() {
  if (sidebarWindow) {
    // @TODO: pull request to @types/chrome
    const document: Document = (<any>sidebarWindow).document
    const container: Element = document.getElementsByTagName('main')[0]

    Sidebar.render(container, Object.assign({}, state, {
      openSource: chrome.devtools.panels.openResource
    }))
  }
}

function listenOnSelectionChanged() {
  chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    emitSelectionToContentScript()
  })
}

function emitSelectionToContentScript() {
  chrome.devtools.inspectedWindow.eval(
    'onDevtoolSelectionChanged($0)',
    // @TODO: pull request to @types/chrome
    <any>{
      useContentScriptContext: true
    }
  );
}


