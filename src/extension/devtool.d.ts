/// <reference path='./background.d.ts'/>

interface DevtoolHelpers {
  backgroundMessageHandler: (message: Message) => void;
  selectionChangedHandler: () => void;
  sidebarInitHandler: (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => void;
}