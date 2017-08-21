/// <reference path='../node_modules/@types/chrome/index.d.ts'/>
/// <reference path='./background.d.ts'/>
/// <reference path='./devtool.d.ts'/>

import MessageType from './tracker/MessageType'
import TrackIDFactory from './tracker/TrackIDFactory'

import Sidebar from './Sidebar'

packFilesToDist()

function packFilesToDist() {
  require('file-loader?name=[name].[ext]!./devtool.html')
  require('file-loader?name=sidebar.html!./Sidebar/index.html')
  require('file-loader?name=sidebar.css!./Sidebar/index.css')
}
let background
let sidebarWindow
let state: State = {
  trackid: TrackIDFactory.generateNullID(),
  records: []
}
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

function renderSidebar() {
  if (sidebarWindow) {
    // @TODO: pull request to @types/chrome, document should be on chrome.windows.Window
    const document: Document = (<any>sidebarWindow).document
    const container: Element = document.getElementsByTagName('main')[0]

    Sidebar.render(container, Object.assign({}, state, {
      openSource: openSource
    }))
  }
}

function updateSidebarOnMessage() {
  background.onMessage.addListener((message: Message) => {
    // console.group('devtool page')
    console.log('--- message received from background ---')
    console.log('message:', message)
    console.log('----------------------------------------')
    // console.groupEnd()

    // console.group('devtool page')
    switch (message.type) {
      case MessageType.ActionStoreUpdated:
        handleActionStoreUpdated(message)
        break
      case MessageType.DevtoolSelectionChanged:
        handleDevtoolSelectionChanged(message)
        break
      default:
    }
    // console.groupEnd()
  })
}

function handleActionStoreUpdated(message: Message) {
  console.log('--- ActionStoreUpdated ---')
  if (message.trackid === state.trackid) {
    updateSidebarBy(message)
  }
  console.log('--------------------------')
}

function handleDevtoolSelectionChanged(message: Message) {
  console.log('--- DevtoolSelectionChanged ---')
  updateSidebarBy(message)
  console.log('-------------------------------')
}

function updateSidebarBy(message: Message) {
  console.log('state before update:', Object.assign({}, state))
  updateStateBy(message)
  console.log('state after update:', Object.assign({}, state))
  renderSidebar()
}

function updateStateBy(message: Message) {
  state = Object.assign({}, state, {
    trackid: message.trackid,
    records: message.records
  })
}

function openSource(url: string, line: number): void {
  // @TODO: pull request to @types/chrome, callback should be optional
  // @NOTE: line add a '-1' offset, it seems that openResource counting lines from 0
  chrome.devtools.panels.openResource(url, line - 1, () => { })
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


