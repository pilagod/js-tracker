interface Window {
  onDevtoolSelectionChanged: (element: Element) => void
}

interface ContentscriptHelpers {
  messageHandler: (message: RecordMessage) => void;
  devtoolSelectionChangedHandler: (element: Element) => void;
  injectScript: (container: Node, scriptText: string) => void;
}