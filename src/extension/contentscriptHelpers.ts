/// <reference path='../tracker/types/ActionStore.d.ts'/>
/// <reference path='../tracker/types/RecordMessage.d.ts'/>
/// <reference path='./types/ContentscriptHelpers.d.ts'/>
/// <reference path='./types/Message.d.ts'/>

import { isTestEnv } from './utils'

class ContentscriptController {
  static SELECTION_IS_CHANGED = true
  static SELECTION_IS_NOT_CHANGED = false

  public selection: Element = null

  private flag: RecordWrapMessage = null
  private store: IActionStore
  private updateSidebar: (message: Message, callback?: (response: any) => void) => void

  constructor(
    store: IActionStore,
    updateSidebar: (message: Message, callback?: (response: any) => void) => void
  ) {
    this.store = store
    this.updateSidebar = updateSidebar
  }

  /* public */

  public messageHandler = async (message: RecordMessage) => {
    switch (message.state) {
      case 'record_start':
        this.recordStartHandler(message)
        break
      case 'record':
        await this.recordDataHandler(message)
        break
      case 'record_end':
        this.recordEndHandler(message)
        break
    }
  }

  public devtoolSelectionChangedHandler = (element: Element) => {
    console.group('contentscript')
    console.log('--- On Devtool Selection Changed ---')
    console.log('selected:', element)
    console.log('------------------------------------')
    console.groupEnd()

    this.selection = element

    this.updateSidebar({
      records: this.store.get(this.getTrackIDFromSelection()),
      selectionChanged: ContentscriptController.SELECTION_IS_CHANGED
    }, this.responseLogger)
  }

  /* private */

  private recordStartHandler(message: RecordWrapMessage) {
    if (this.flag) {
      return
    }
    this.flag = message
  }

  private async recordDataHandler(message: RecordDataMessage) {
    const info: ActionInfo = Object.assign({}, message.data, this.flag.data)
    const success = !!this.flag && await this.store.registerFromActionInfo(info)
    // @NOTE: it's easy to forget await store, success must be resolved value of boolean instead of Promise
    if (success === true && !this.isSelectionChanged(info.trackid)) {
      console.group('contentscript')
      console.log('--- On Selected Element Updated ---')
      console.log('selected:', this.selection)
      console.log('------------------------------------')
      console.groupEnd()

      this.updateSidebar({
        records: this.store.get(info.trackid),
        selectionChanged: ContentscriptController.SELECTION_IS_NOT_CHANGED
      }, this.responseLogger)
    }
  }

  private isSelectionChanged(newID: TrackID): boolean {
    return this.getTrackIDFromSelection() !== newID
  }

  private getTrackIDFromSelection(): TrackID {
    return this.selection instanceof Element ? this.selection.getAttribute('trackid') : null
  }

  private responseLogger(response: any) {
    console.group('contentscript')
    console.log('--- Response from Background---')
    console.log('response:', response)
    console.log('-------------------------------')
    console.groupEnd()
  }

  private recordEndHandler(message: RecordWrapMessage) {
    const { loc: loc1 } = this.flag.data
    const { loc: loc2 } = message.data

    if (loc1.scriptUrl === loc2.scriptUrl
      && loc1.lineNumber === loc2.lineNumber
      && loc1.columnNumber === loc2.columnNumber
    ) {
      this.flag = null
    }
  }
}

function injectScript(container: Node, scriptText: string) {
  const script = document.createElement('script')

  script.textContent = scriptText

  container.appendChild(script)
  container.removeChild(script)
}

export default function (
  store: IActionStore,
  updateSidebar: (message: Message, callback?: (response: any) => void) => void
): ContentscriptHelpers {
  const contentscriptController = new ContentscriptController(store, updateSidebar)
  const helpers = {
    messageHandler: contentscriptController.messageHandler,
    devtoolSelectionChangedHandler: contentscriptController.devtoolSelectionChangedHandler,
    injectScript
  }
  if (isTestEnv()) {
    Object.assign(helpers, { contentscriptController })
  }
  return helpers
}