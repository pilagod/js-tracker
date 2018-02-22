interface Window {
  onDevtoolSelectionChanged: (element: Element) => void
}

interface ContentscriptHelpers {
  messageHandler: (message: ActionMessage) => void;
  devtoolSelectionChangedHandler: (element: Element) => void;
  injectScript: (container: Node, scriptText: string) => void;
}