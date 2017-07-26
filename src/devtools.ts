/// <reference path='../node_modules/@types/chrome/index.d.ts'/>

require('./devtools.html')
require('./sidebar.html')
require('./sidebar.css')

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Sidebar from './sidebar'

const background = chrome.runtime.connect({
  name: 'js-tracking devtool panel'
})

background.postMessage({
  type: 'init',
  tabID: (chrome.devtools.inspectedWindow.tabId).toString()
})

chrome.devtools.panels.elements.createSidebarPane('JS Tracker', (sidebar) => {
  background.onMessage.addListener((record) => {
    console.group('devtools page')
    console.log('--- record got from background ---')
    console.log('record:', record)
    console.log('----------------------------------')
    console.groupEnd()

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
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  // send selected element to content script
  // @TODO: pull request to @types/chrome
  chrome.devtools.inspectedWindow.eval('onDevtoolsSelectionChanged($0)', <any>{ useContentScriptContext: true });
});
