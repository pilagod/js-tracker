/// <reference path='../node_modules/@types/chrome/index.d.ts' />
/// <reference path='./background.d.ts'/>

class ConnectionCache implements IConnectionCache {

  constructor() {
    this._connections = {}
  }

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

  /* private */

  private _connections
}
const cache = new ConnectionCache()

listenOnDevtoolsConnected(cache)
listenOnActionRecordFromContentScript(cache)
listenOnExtensionStarted()

function listenOnDevtoolsConnected(cache: ConnectionCache) {
  chrome.runtime.onConnect.addListener((devtool) => {
    const initHandler = (
      message: {
        type: string,
        tabID: string
      }
    ) => {
      message.type === 'init' && cache.add(message.tabID, devtool)
    }
    devtool.onMessage.addListener(initHandler);
    devtool.onDisconnect.addListener(() => {
      devtool.onMessage.removeListener(initHandler);
      cache.remove(devtool)
    })
  })
}

function listenOnActionRecordFromContentScript(cache: ConnectionCache) {
  // message listener for content script
  chrome.runtime.onMessage.addListener((record, sender, sendResponseToContentScript) => {
    console.log('background on contentscript message')

    let message: string
    // messages from contentscript should have sender.tab set
    if (sender.tab) {
      let tabID = (sender.tab.id).toString()

      if (cache.has(tabID)) {
        // cache.get(tabID).postMessage(record)
        message = 'done'
      } else {
        message = 'target tab has no devtools opened'
      }
    } else {
      message = 'target tab is not defined'
    }
    console.group('background')
    console.log('--- forward record from content script to devtools ---')
    message === 'done'
      ? console.log(message)
      : console.error(message)
    console.log('------------------------------------------------------')
    console.groupEnd()
    sendResponseToContentScript({ message })
  })
}

function listenOnExtensionStarted() {
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
        // inject script to new created tab, start tracking javascript
        chrome.tabs.executeScript(tab.id, {
          file: 'dist/contentscript.js',
          runAt: 'document_start'
        })
      })
    })
  })
}


