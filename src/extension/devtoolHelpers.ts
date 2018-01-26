/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='./background.d.ts'/>
/// <reference path='./devtool.d.ts'/>

import { ISidebarRootProps } from '../extension/Sidebar/SidebarRoot'
import { isTestEnv } from './utils'

class SidebarController {
  static SHOULD_TAG_DIFFS = true
  static SHOULD_NOT_TAG_DIFFS = false

  public records: ActionRecord[] = []
  public sidebarWindow: chrome.windows.Window = null

  private panels: typeof chrome.devtools.panels
  private renderSidebar: (container: Element, props: ISidebarRootProps) => void

  constructor(
    panels: typeof chrome.devtools.panels,
    renderSidebar: (container: Element, props: ISidebarRootProps) => void
  ) {
    this.panels = panels
    this.renderSidebar = renderSidebar
  }

  /* public */

  public init = (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => {
    sidebar.setPage('dist/sidebar.html')
    sidebar.onShown.addListener(this.onShown)
    sidebar.onHidden.addListener(this.onHidden)
  }

  public render = (shouldTagDiffs: boolean) => {
    if (!this.sidebarWindow) {
      return
    }
    const document: Document = (<any>this.sidebarWindow).document
    const container: Element = document.getElementsByTagName('main')[0]

    this.renderSidebar(container, {
      records: this.records,
      shouldTagDiffs,
      openSource: this.openSource
    })
  }

  /* private */

  private onShown = (sidebarWindow: chrome.windows.Window) => {
    if (!this.sidebarWindow) {
      this.sidebarWindow = sidebarWindow
    }
    this.render(SidebarController.SHOULD_NOT_TAG_DIFFS)
  }

  private onHidden = () => {
    this.sidebarWindow = null
  }

  private openSource = (url: string, line: number) => {
    // @NOTE: there is 1 offset of line number between stacktrace and openResource
    this.panels.openResource(url, line - 1, () => { })
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

function makePackFilesHandler(packFileToDist: (path: string, distname: string) => void) {
  return (files: { path: string, distname: string }[]) => {
    files.map((file) => {
      packFileToDist(file.path, file.distname)
    })
  }
}

export default function (
  devtools: typeof chrome.devtools,
  renderSidebar: (container: Element, props: ISidebarRootProps) => void
) {
  const sidebarController = new SidebarController(devtools.panels, renderSidebar)
  const updateSelection = makeUpdateSelection(devtools.inspectedWindow)
  const helpers: DevtoolHelpers = {
    backgroundMessageHandler: makeBackgroundMessageHandler(sidebarController),
    selectionChangedHandler: () => updateSelection(),
    sidebarInitHandler: sidebarController.init,
  }
  if (isTestEnv()) {
    Object.assign(helpers, { sidebarController })
  }
  return helpers
}