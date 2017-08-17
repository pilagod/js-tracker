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
  diff: number
}

export default class SidebarList extends React.Component<ISidebarListProps, ISidebarListState> {
  constructor(props) {
    super(props)

    this.state = {
      diff: -1 // an index indicating new added records
    }
  }

  componentWillReceiveProps(nextProps: ISidebarListProps) {
    this.setState(() => {
      return {
        diff: this.diff(this.props, nextProps)
      }
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
          className={`record ${this.labelDiff(index)}`}
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

  private diff(preProps: ISidebarListProps, nextProps: ISidebarListProps) {
    return this.shouldCalculateDiff(preProps, nextProps)
      ? this.calculateDiff(preProps, nextProps)
      : -1
  }

  private shouldCalculateDiff(preProps: ISidebarListProps, nextProps: ISidebarListProps) {
    // @NOTE: only calculate diff when 
    //  (1) records is not updated by filter
    //  (2) identical trackid is required before and after records updated
    return !nextProps.isFilterUpdated && preProps.trackid === nextProps.trackid
  }

  private calculateDiff(preProps: ISidebarListProps, nextProps: ISidebarListProps) {
    return nextProps.records.length - preProps.records.length
  }

  private labelDiff(index: number) {
    return index < this.state.diff ? 'record-diff' : ''
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