/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'

import ActionType from './tracker/ActionType'

interface ISidebarListProps {
  trackid: TrackID;
  records: ActionRecord[];
  openSource: (
    url: string,
    line: number
  ) => void;
}

interface ISidebarListState {
  lastDiffIndex: number
}

export default class SidebarList extends React.Component<ISidebarListProps, ISidebarListState> {
  constructor(props) {
    super(props)

    this.state = {
      lastDiffIndex: -1
    }
  }

  componentWillReceiveProps(nextProps: ISidebarListProps) {
    let lastDiffIndex

    if (this.props.trackid === nextProps.trackid) {
      lastDiffIndex =
        nextProps.records.length - this.props.records.length
    } else {
      lastDiffIndex = -1
    }
    this.setState(() => {
      return { lastDiffIndex }
    })
  }

  linkTo(url: string, line: number, e: Event) {
    e.preventDefault()
    this.props.openSource(url, line)
  }

  render() {
    const records = this.props.records.map((record, index) => {
      const { scriptUrl, lineNumber, columnNumber } = record.source.loc
      const link = `${scriptUrl}:${lineNumber}:${columnNumber}`
      const tag = ActionType[record.type]

      return (
        <div key={index} className={`record ${index < this.state.lastDiffIndex ? 'record-diff' : ''}`}>
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
