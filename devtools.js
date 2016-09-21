var backgroundConnection = chrome.runtime.connect({
  name: 'js-tracking panel'
});

backgroundConnection.postMessage({
  type: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

chrome.devtools.panels.elements.createSidebarPane('JS Tracking', function (sidebar) {
  backgroundConnection.onMessage.addListener(function (message) {
    console.log('message got:', message);
    sidebar.setObject(message);
  });
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
  // send selected element to content script
  chrome.devtools.inspectedWindow.eval('onDevtoolsSelectionChanged($0)', { useContentScriptContext: true });
});
