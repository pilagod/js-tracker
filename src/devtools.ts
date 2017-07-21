/// <reference path='../node_modules/@types/chrome/index.d.ts' />

require('./devtools.html')

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
    sidebar.setObject(record);
  });
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  // send selected element to content script
  // @TODO: pull request to @types/chrome
  chrome.devtools.inspectedWindow.eval('onDevtoolsSelectionChanged($0)', <any>{ useContentScriptContext: true });
});
