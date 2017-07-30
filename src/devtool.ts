/// <reference path='../node_modules/@types/chrome/index.d.ts'/>
/// <reference path='./background.d.ts'/>

import MessageType from './MessageType'
import Sidebar from './Sidebar'

packFilesToDist()

function packFilesToDist() {
  require('./devtool.html')
  require('./sidebar.html')
  require('./sidebar.css')
}

const state = {
  trackid: null,
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
      renderSidebar(sidebarWindow, state.records)
    })
  })
}

function updateSidebarOnMessage() {
  background.onMessage.addListener((message: Message) => {
    console.group('devtool page')
    console.log('--- message got from background ---')
    console.log('message:', message)
    console.log('-----------------------------------')
    console.groupEnd()

    updateStateBy(message)
    renderSidebar(sidebarWindow, state.records)
  })
}

function updateStateBy(message: Message) {
  switch (message.type) {
    case MessageType.ActionStoreUpdated:
      if (state.trackid === message.trackid) {
        state.records = message.records
      }
    case MessageType.DevtoolSelectionChanged:
      state.trackid = message.trackid
      state.records = message.records
  }
}

function renderSidebar(window: chrome.windows.Window, records: ActionRecord[] = []) {
  if (window) {
    // @TODO: pull request to @types/chrome
    const document: Document = (<any>window).document
    const container: Element = document.getElementsByTagName('main')[0]

    Sidebar.render(container, records)
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


