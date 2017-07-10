// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function () {
  // get current active tab
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // create a new tab with current active tab url
    chrome.tabs.create({
      url: tabs[0].url
    }, function (tab) {
      // inject script to new created tab
      // start tracking javascript
      chrome.tabs.executeScript(tab.id, {
        file: 'src/contentscript.js',
        runAt: 'document_start'
      })
    })
  })
})
