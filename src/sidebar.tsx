/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface ISidebarRootProps {
  records: ActionRecord[];
}

interface ISidebarRootState {
  filter: number;
}

class SidebarRoot extends React.Component<ISidebarRootProps, ISidebarRootState> {
  constructor(props) {
    super(props)
  }

  open(url: string, lineNumber: number, e: Event) {
    e.preventDefault()
    chrome.devtools.panels.openResource(url, lineNumber - 1, () => { })
  }

  render() {
    // @TODO: add tooltip to link
    const recordList = this.props.records.map((record, index) => {
      const { scriptUrl, lineNumber } = record.source.loc

      return (
        <div key={index}>
          <ul>
            <li>
              type: {record.type}
            </li>
            <li>
              <span>loc:</span>
              <a href={record.key} onClick={this.open.bind(null, scriptUrl, lineNumber)}>
                {record.key}
              </a>
            </li>
            <li>
              code: {record.source.code}
            </li>
          </ul>
        </div>
      )
    })
    return (
      <div id="sidebar-root">
        This is root of sidebar
        {recordList}
      </div>
    )
  }
}

const Sidebar = {
  render(container: Element, records: ActionRecord[] = []): void {
    ReactDOM.render(
      <SidebarRoot records={records} />,
      container
    )
  }
}
export default Sidebar
