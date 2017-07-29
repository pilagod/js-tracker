/// <reference path='../node_modules/@types/chrome/index.d.ts'/>
/// <reference path='./background.d.ts'/>

require('./devtool.html')
require('./sidebar.html')
require('./sidebar.css')

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Sidebar from './sidebar'

const background = chrome.runtime.connect({
  name: 'JS-Tracer Devtool'
})

background.postMessage({
  type: 'init',
  tabID: (chrome.devtools.inspectedWindow.tabId).toString()
})

background.onMessage.addListener((message: Message) => {
  console.group('devtool page')
  console.log('--- message got from background ---')
  console.log('message:', message)
  console.log('-----------------------------------')
  console.groupEnd()
});

chrome.devtools.panels.elements.createSidebarPane('JS Tracker', (sidebar) => {
  sidebar.setPage('dist/sidebar.html');
  sidebar.onShown.addListener((window) => {
    // @TODO: pull request to @types/chrome
    const document = <Document>(<any>window).document

    ReactDOM.render(
      React.createElement(Sidebar),
      document.getElementById('main')
    )
  })
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  // send selected element to content script
  // @TODO: pull request to @types/chrome
  chrome.devtools.inspectedWindow.eval('onDevtoolSelectionChanged($0)', <any>{ useContentScriptContext: true });
});
