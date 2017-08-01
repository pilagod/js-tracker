/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import SidebarRoot from './SidebarRoot'

export default {
  render(container: Element, records: ActionRecord[] = []): void {
    ReactDOM.render(
      React.createElement(SidebarRoot, { records }),
      container
    )
  }
}
