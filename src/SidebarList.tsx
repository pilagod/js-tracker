import * as React from 'react'

export default class SidebarList extends React.Component {
  // @TODO: add tooltip to link
  constructor(props) {
    super(props)
  }
  // open(url: string, lineNumber: number, e: Event) {
  //   e.preventDefault()
  //   chrome.devtools.panels.openResource(url, lineNumber - 1, () => { })
  // }
  render() {
    return (
      <div className="sidebar-list"></div>
    )
  }
}
