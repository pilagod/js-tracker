/// <reference path='../../public/types/RecordStoreMessages.d.ts'/>

interface Window {
  onDevtoolSelectionChanged: (element: Element) => void
}

interface ContentscriptHelpers {
  devtoolSelectionChangedHandler: (element: Element) => void;
  injectScript: (container: Node, scriptText: string) => void;
  recordStoreAddMessageHandler: (message: RecordStoreAddMessage) => Promise<void[]>;
}