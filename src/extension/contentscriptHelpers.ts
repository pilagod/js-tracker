/// <reference path='./public/types/RecordStoreMessages.d.ts'/>
/// <reference path='./private/types/ActionRecordStore.d.ts'/>
/// <reference path='./private/types/ContentscriptHelpers.d.ts'/>
/// <reference path='./private/types/DisplayMessages.d.ts'/>

import { match } from '../tracker/public/SourceLocation'
import { isTestEnv } from './utils'

class ContentscriptController {
  static SELECTION_IS_CHANGED = true
  static SELECTION_IS_NOT_CHANGED = false

  public selection: Element = null

  private store: IActionRecordStore
  private updateSidebar: (message: DisplayMessage, callback?: (response: any) => void) => void

  constructor(
    store: IActionRecordStore,
    updateSidebar: (message: DisplayMessage, callback?: (response: any) => void) => void
  ) {
    this.store = store
    this.updateSidebar = updateSidebar
  }

  /* public */

  public recordStoreAddMessageHandler = (message: RecordStoreAddMessage) => {
    const loc = message.loc
    // @NOTE: return promise here is for testing
    return Promise.all(
      message.data.map(async (data: RecordStoreAddData) => {
        const success = await this.store.registerFromActionInfo(
          Object.assign(data, { loc })
        )
        if (success === true && !this.isSelectionChanged(data.trackid)) {
          this.updateSidebar({
            records: this.store.get(data.trackid),
            selectionChanged: ContentscriptController.SELECTION_IS_NOT_CHANGED
          })
        }
      })
    )
  }

  public devtoolSelectionChangedHandler = (element: Element) => {
    this.selection = element
    this.updateSidebar({
      records: this.store.get(this.getTrackIDFromSelection()),
      selectionChanged: ContentscriptController.SELECTION_IS_CHANGED
    })
  }

  /* private */

  private isSelectionChanged(trackid: TrackID): boolean {
    return this.getTrackIDFromSelection() !== trackid
  }

  private getTrackIDFromSelection(): TrackID {
    return this.selection instanceof Element ? this.selection.getAttribute('trackid') : null
  }
}

function injectScript(container: Node, scriptText: string) {
  const script = document.createElement('script')

  script.textContent = scriptText

  container.appendChild(script)
  container.removeChild(script)
}

export default function (
  store: IActionRecordStore,
  updateSidebar: (message: DisplayMessage, callback?: (response: any) => void) => void
): ContentscriptHelpers {
  const contentscriptController = new ContentscriptController(store, updateSidebar)
  const helpers: ContentscriptHelpers = {
    devtoolSelectionChangedHandler: contentscriptController.devtoolSelectionChangedHandler,
    injectScript,
    recordStoreAddMessageHandler: contentscriptController.recordStoreAddMessageHandler,
  }
  if (isTestEnv()) {
    Object.assign(helpers, { contentscriptController })
  }
  return helpers
}