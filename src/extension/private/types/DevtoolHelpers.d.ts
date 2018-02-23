/// <reference path='./DisplayMessages.d.ts'/>

interface DevtoolHelpers {
  backgroundMessageHandler: (message: DisplayMessage) => void;
  selectionChangedHandler: () => void;
  sidebarInitHandler: (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => void;
}