var connections = {};

chrome.runtime.onConnect.addListener(function (devtoolsConnection) {
  var devtoolsMessageListener = function (message/*, sender, sendResponse*/) {
    if (message.type === 'init') {
      connections[message.tabId] = devtoolsConnection;
    }
  };
  // message listener for devtools
  devtoolsConnection.onMessage.addListener(devtoolsMessageListener);

  devtoolsConnection.onDisconnect.addListener(function (connection) {
    // connection is the devtoolsConnection which is going to be disconnected
    connection.onMessage.removeListener(devtoolsMessageListener);

    var tabs = Object.keys(connections);
    var len = tabs.length;

    for (var i = 0; i < len; i += 1) {
      if (connections[tabs[i]] === connection) {
        delete connections[tabs[i]];
        break;
      }
    }
  })
});

// message listener for content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('message from content script:', request, sender);
  // messages from content scripts should have sender.tab set
  if (sender.tab) {
    var tabId = sender.tab.id;

    if (tabId in connections) {
      connections[tabId].postMessage(request);
      sendResponse({message: 'done'})
    } else {
      console.log('tab not found in connection list');
      sendResponse({message: 'tab not found in connection list'})
    }
  } else {
    console.log('sender.tab not defined');
    sendResponse({message: 'sender.tab not defined'})
  }
  return true;
});

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
        file: 'contentscript-dist.js',
        runAt: 'document_start'
      })
    })
  })
});
