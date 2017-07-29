/// <reference path='./injectscript.d.ts'/>

interface Window {
  onDevtoolSelectionChanged: (owner: Owner) => void
}