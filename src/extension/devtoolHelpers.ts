/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='./background.d.ts'/>

import { ISidebarRootProps } from '../extension/Sidebar/SidebarRoot'
import { isTestEnv } from './utils'

class SidebarController {
  static SHOULD_TAG_DIFFS = true
  static SHOULD_NOT_TAG_DIFFS = false

  public records: ActionRecord[] = []
  public sidebarWindow: chrome.windows.Window = null

  private _panels: typeof chrome.devtools.panels
  private _renderSidebar: (container: Element, props: ISidebarRootProps) => void

  constructor(
    panels: typeof chrome.devtools.panels,
    renderSidebar: (container: Element, props: ISidebarRootProps) => void
  ) {
    this._panels = panels
    this._renderSidebar = renderSidebar
  }

  /* public */

  public init = (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => {
    sidebar.setPage('dist/sidebar.html')
    sidebar.onShown.addListener(this.onShown)
  }

  public onShown = (sidebarWindow: chrome.windows.Window) => {
    if (!this.sidebarWindow) {
      this.sidebarWindow = sidebarWindow
    }
    this.render(SidebarController.SHOULD_NOT_TAG_DIFFS)
  }

  public render = (shouldTagDiffs: boolean) => {
    if (!this.sidebarWindow) {
      return
    }
    const document: Document = (<any>this.sidebarWindow).document
    const container: Element = document.getElementsByTagName('main')[0]

    this._renderSidebar(container, {
      records: this.records,
      shouldTagDiffs,
      openSource: this.openSource
    })
  }

  public openSource = (url: string, line: number) => {
    // @NOTE: line is counting from 0
    this._panels.openResource(url, line - 1, () => { })
  }
}

function makeBackgroundMessageHandler(sidebarController: SidebarController) {
  function shouldTagDiffs(selectionChanged: boolean) {
    return selectionChanged
      ? SidebarController.SHOULD_NOT_TAG_DIFFS
      : SidebarController.SHOULD_TAG_DIFFS
  }
  return (message: Message) => {
    console.group('devtool page')
    console.log('--- message received from background ---')
    console.log('message:', message)
    console.log('----------------------------------------')
    console.groupEnd()

    sidebarController.records = message.records
    sidebarController.render(shouldTagDiffs(message.selectionChanged))
  }
}

function makeUpdateSelection(inspectedWindow: typeof chrome.devtools.inspectedWindow) {
  return () => inspectedWindow.eval(
    `onDevtoolSelectionChanged($0)`,
    // @TODO: pull request to @types/chrome
    <any>{
      useContentScriptContext: true
    }
  )
}

export default function (
  devtools: typeof chrome.devtools,
  renderSidebar: (container: Element, props: ISidebarRootProps) => void
) {
  const sidebarController = new SidebarController(devtools.panels, renderSidebar)
  const updateSelection = makeUpdateSelection(devtools.inspectedWindow)
  const helpers = {
    sidebarInitHandler: sidebarController.init,
    backgroundMessageHandler: makeBackgroundMessageHandler(sidebarController),
    selectionChangedHandler: () => updateSelection(),
  }
  if (isTestEnv()) {
    Object.assign(helpers, { sidebarController })
  }
  return helpers
}