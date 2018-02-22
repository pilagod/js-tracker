/// <reference path='../../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./private/types/Message.d.ts'/>

class ConnectionCache {
  private _connections: {
    [tabID: string]: chrome.runtime.Port
  } = {}

  /* public */

  public add(tabID: string, port: chrome.runtime.Port): void {
    this._connections[tabID] = port
  }

  public get(tabID: string): chrome.runtime.Port {
    return this._connections[tabID]
  }

  public has(tabID: string): boolean {
    return !!(this._connections[tabID])
  }

  public remove(port: chrome.runtime.Port): void {
    for (let tabID of Object.keys(this._connections)) {
      if (this._connections[tabID] === port) {
        delete this._connections[tabID]
        break
      }
    }
  }
}
const connectionCache = new ConnectionCache()

listenOnDevtoolsConnected()
listenOnActionRecordFromContentScript()
listenOnExtensionStarted()

function listenOnDevtoolsConnected() {
  chrome.runtime.onConnect.addListener((devtool) => {
    const initHandler = (
      message: {
        type: string,
        tabID: string
      }
    ) => {
      message.type === 'init' && connectionCache.add(message.tabID, devtool)
    }
    devtool.onMessage.addListener(initHandler);
    devtool.onDisconnect.addListener(() => {
      devtool.onMessage.removeListener(initHandler);
      connectionCache.remove(devtool)
    })
  })
}

function listenOnActionRecordFromContentScript() {
  // message listener for content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponseToContentScript) => {
    const tabID = sender.tab && sender.tab.id.toString()
    const { status, description } = validateTabID(tabID)

    if (status === 'OK') {
      connectionCache.get(tabID).postMessage(message)
    }
    console.group('background')
    console.log('--- forward message from content script to devtool ---')
    console.log('message:', message);
    (status === 'OK'
      ? console.log
      : console.error
    )('status:', `${status}, ${description}`)
    console.log('-------------------------------------------------------')
    console.groupEnd()
    sendResponseToContentScript({ status, description })
  })

  function validateTabID(tabID: string = ''): { status: string, description: string } {
    return connectionCache.has(tabID)
      ? { status: 'OK', description: 'done' }
      : { status: 'ERR', description: 'target tab has no devtool opened' }
  }
}

function listenOnExtensionStarted() {
  // Called when the user clicks on the browser action.
  chrome.browserAction.onClicked.addListener(() => {
    // get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // create a new tab with current active tab url
      chrome.tabs.create({ url: tabs[0].url }, (tab) => {
        // inject script to new created tab, start tracking javascript
        chrome.tabs.executeScript(tab.id, {
          file: 'dist/contentscript.js',
          runAt: 'document_start'
        })
      })
    })
  })
}


