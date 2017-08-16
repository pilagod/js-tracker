/// <reference path='../tracker/ActionStore.d.ts'/>
/// <reference path='../tracker/TrackIDManager.d.ts'/>

import * as React from 'react'

import ActionType, { ActionTypeNames } from '../tracker/ActionType'

interface ISidebarListProps {
  trackid: TrackID;
  records: ActionRecord[];
  isFilterUpdated: boolean;
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
      this.shouldLabelDiffs(nextProps)
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
          {createRecordTags(record.type)}
          {createRecordLink(record.source.loc, this.linkTo.bind(this))}
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

  /* private */

  private shouldLabelDiffs(nextProps: ISidebarListProps) {
    // @NOTE: only label diffs when 
    //  (1) records is not updated by filter
    //  (2) identical trackid is required before and after updating
    return !nextProps.isFilterUpdated && this.props.trackid === nextProps.trackid
  }
}

function createRecordTags(actionType: ActionType): JSX.Element {
  const tags = ActionTypeNames.reduce((tags, type, index) => {
    if (actionType & ActionType[type]) {
      tags.push((
        <div
          key={index}
          className={`tag tag-${type.toLowerCase()}`}
        >
          {type}
        </div>)
      )
    }
    return tags
  }, [])
  return (
    <div className="record-tag">
      {tags}
    </div>
  )
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