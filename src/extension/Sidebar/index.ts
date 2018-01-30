import * as React from 'react'
import * as ReactDOM from 'react-dom'

import SidebarRoot, { ISidebarRootProps } from './SidebarRoot'

export default {
  render(container: Element, props: ISidebarRootProps): void {
    ReactDOM.render(
      React.createElement(SidebarRoot, { ...props }),
      container
    )
  }
}
