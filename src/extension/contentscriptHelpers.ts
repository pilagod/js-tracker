/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='../recordMessage.d.ts'/>
/// <reference path='./background.d.ts'/>

import { isTestEnv } from './utils'

class ContentscriptController {
  static SELECTION_IS_CHANGED = true
  static SELECTION_IS_NOT_CHANGED = false

  public selection: Element = null

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

  public recordHandler = (() => {
    let flag: RecordWrapMessage = null

    return async (message: RecordMessage) => {
      switch (message.state) {
        case 'record_start':
          flag || (flag = message)
          break

        case 'record':
          const success =
            flag && this.store.registerFromActionInfo(Object.assign({}, message.data, flag.data))

          if (success && !this.isSelectionChanged(message.data.trackid)) {
            console.group('contentscript')
            console.log('--- On Selected Element Updated ---')
            console.log('selected:', this.selection)
            console.log('------------------------------------')
            console.groupEnd()

            this.updateSidebar({
              records: this.store.get(message.data.trackid),
              selectionChanged: ContentscriptController.SELECTION_IS_NOT_CHANGED
            }, responseLogger)
          }
          break

        case 'record_end':
          (flag.data.loc === message.data.loc) && (flag = null)
          break
      }
    }
  })()

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
    }, responseLogger)
  }

  /* private */

  private isSelectionChanged(newID: TrackID): boolean {
    return this.getTrackIDFromSelection() !== newID
  }

  private getTrackIDFromSelection(): TrackID {
    return this.selection instanceof Element ? this.selection.getAttribute('trackid') : null
  }
}

function responseLogger(response: any) {
  console.group('contentscript')
  console.log('--- Response from Background---')
  console.log('response:', response)
  console.log('-----------------------------')
  console.groupEnd()
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
) {
  const contentscriptController = new ContentscriptController(store, updateSidebar)
  const helpers = {
    recordHandler: contentscriptController.recordHandler,
    devtoolSelectionChangedHandler: contentscriptController.devtoolSelectionChangedHandler,
    injectScript
  }
  if (isTestEnv()) {
    Object.assign(helpers, { contentscriptController })
  }
  return helpers
}