/// <reference path='../node_modules/@types/chrome/index.d.ts' />

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(() => {
  // get current active tab
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    // create a new tab with current active tab url
    chrome.tabs.create({
      url: tabs[0].url
    }, (tab) => {
      // inject script to new created tab
      // start tracking javascript
      chrome.tabs.executeScript(tab.id, {
        file: 'dist/contentscript.js',
        runAt: 'document_start'
      })
    })
  })
})
