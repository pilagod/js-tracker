/// <reference path='../tracker/ActionStore.d.ts'/>
/// <reference path='../tracker/TrackIDManager.d.ts'/>

import * as React from 'react'

import ActionType, { ActionTypeNames } from '../tracker/ActionType'

interface ISidebarListProps {
  trackid: TrackID;
  records: ActionRecord[];
  openSource: (url: string, line: number) => void;
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
    const lastDiffIndex =
      this.props.trackid === nextProps.trackid
        ? nextProps.records.length - this.props.records.length
        : -1
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
      return (
        <div
          key={index}
          className={`record ${index < this.state.lastDiffIndex ? 'record-diff' : ''}`}
        >
          {createRecordTitle(record, this.linkTo.bind(this))}
          {createRecordInfo(record)}
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

function createRecordTitle(record: ActionRecord, linkOnClicked: (e: any) => void): JSX.Element {
  return (
    <div className="record-title">
      {createRecordTags(record.type)}
      {createRecordLink(record.source.loc, linkOnClicked)}
    </div>
  )
}

function createRecordTags(actionType: ActionType): JSX.Element[] {
  return ActionTypeNames.reduce((tags, type, index) => {
    if (actionType & ActionType[type]) {
      tags.push((
        <div
          key={index}
          className="record-tag"
        >
          {type}
        </div>)
      )
    }
    return tags
  }, [])
}

function createRecordLink(
  { scriptUrl, lineNumber, columnNumber },
  linkOnClicked: (e: any) => void
): JSX.Element {
  return (
    <a
      className="record-link"
      onClick={linkOnClicked.bind(null, scriptUrl, lineNumber)}
    >
      {`${scriptUrl}:${lineNumber}:${columnNumber}`}
    </a>
  )
}

function createRecordInfo(record: ActionRecord): JSX.Element {
  return (
    <div className="record-info">
      <span>{record.source.code}</span>
    </div>
  )
}