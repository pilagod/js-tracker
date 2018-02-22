/// <reference path='../../node_modules/@types/chrome/index.d.ts'/>
/// <reference path='./private/types/DevtoolHelpers.d.ts'/>

import initDevtoolHelpers from './devtoolHelpers'
import { isTestEnv } from './utils'

function main(
  __chrome__: typeof chrome,
  helpers: DevtoolHelpers
) {
  setupConnectionToBackground(__chrome__, helpers.backgroundMessageHandler)
  setupSidebar(__chrome__, helpers.sidebarInitHandler)
  listenToDevtoolSelectionChanged(__chrome__, helpers.selectionChangedHandler)
}

function setupConnectionToBackground(
  __chrome__: typeof chrome,
  backgroundMessageHandler: (message: Message) => void
) {
  const tabID = __chrome__.devtools.inspectedWindow.tabId.toString()
  const background = __chrome__.runtime.connect({
    name: 'js-tracker devtool of tab ' + tabID
  })
  background.postMessage({ type: 'init', tabID })
  background.onMessage.addListener(backgroundMessageHandler)
}

function setupSidebar(
  __chrome__: typeof chrome,
  sidebarInitHandler: (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => void
) {
  __chrome__.devtools.panels.elements.createSidebarPane(
    'JS-Tracker',
    sidebarInitHandler
  )
}

function listenToDevtoolSelectionChanged(
  __chrome__: typeof chrome,
  selectionChangedHandler: () => void
) {
  selectionChangedHandler() // init selection
  __chrome__.devtools.panels.elements.onSelectionChanged.addListener(
    selectionChangedHandler
  )
}

if (!isTestEnv()) {
  main(
    chrome,
    initDevtoolHelpers(
      chrome.devtools,
      require('./Sidebar').default.render
    )
  )
}
export default isTestEnv() ? main : null