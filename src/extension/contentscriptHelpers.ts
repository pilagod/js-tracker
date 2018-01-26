/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='./background.d.ts'/>

import { isTestEnv } from './utils'

class State {
  static SELECTION_IS_CHANGED = true
  static SELECTION_IS_NOT_CHANGED = false

  public selection: Element = null

  public isSelectionChanged(newID: TrackID): boolean {
    return this.getTrackIDFromSelection() !== newID
  }

  public getTrackIDFromSelection(): TrackID {
    return this.selection instanceof Element ? this.selection.getAttribute('trackid') : null
  }
}

function makeActionHandler(
  state: State,
  store: IActionStore,
  updateSidebar: (message: Message, callback?: (response: any) => void) => void
) {
  return async (info: ActionInfo) => {
    const success = await store.registerFromActionInfo(info)

    if (success && !state.isSelectionChanged(info.trackid)) {
      console.group('contentscript')
      console.log('--- On Selected Element Updated ---')
      console.log('selected:', state.selection)
      console.log('------------------------------------')
      console.groupEnd()

      updateSidebar({
        records: store.get(info.trackid),
        selectionChanged: State.SELECTION_IS_NOT_CHANGED
      }, responseLogger)
    }
  }
}

function makeDevtoolSelectionChangedHandler(
  state: State,
  store: IActionStore,
  updateSidebar: (message: Message, callback?: (response: any) => void) => void
) {
  return (element: Element) => {
    console.group('contentscript')
    console.log('--- On Devtool Selection Changed ---')
    console.log('selected:', element)
    console.log('------------------------------------')
    console.groupEnd()

    state.selection = element

    updateSidebar({
      records: store.get(state.getTrackIDFromSelection()),
      selectionChanged: State.SELECTION_IS_CHANGED
    }, responseLogger)
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
  const state = new State()
  const helpers = {
    actionHandler: makeActionHandler(state, store, updateSidebar),
    devtoolSelectionChangedHandler: makeDevtoolSelectionChangedHandler(state, store, updateSidebar),
    injectScript
  }
  isTestEnv() && Object.assign(helpers, { state })

  return helpers
}