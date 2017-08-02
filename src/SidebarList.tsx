/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'

import ActionType from './tracker/ActionType'

interface ISidebarListProps {
  records: ActionRecord[];
  openResource: (
    url: string,
    line: number
  ) => void;
}

export default class SidebarList extends React.Component<ISidebarListProps> {
  // @TODO: add tooltip to link
  constructor(props) {
    super(props)
  }

  linkTo(url: string, line: number, e: Event) {
    e.preventDefault()
    this.props.openResource(url, line)
  }

  render() {
    const records = this.props.records.map((record, index) => {
      const { scriptUrl, lineNumber, columnNumber } = record.source.loc
      const tag = ActionType[record.type]
      const link = `${scriptUrl}:${lineNumber}:${columnNumber}`

      return (
        <div key={index} className="record">
          <div className="record-title">
            <div className="record-tag">{tag}</div>
            <a
              className="record-link"
              onClick={this.linkTo.bind(this, scriptUrl, lineNumber)}
            >
              {link}
            </a>
          </div>
          <div className="record-info">
            <span>{record.source.code}</span>
          </div>
        </div>
      )
    })
    return (
      <div className="sidebar-list">
        {records}
      </div>
    )
  }
}
