/// <reference path='../../tracker/public/ActionStore.d.ts'/>

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import ActionType, {
  ActionTypeNames
} from '../../tracker/public/ActionType'

interface ISidebarListProps {
  records: ActionRecord[];
  shouldTagDiffs: boolean;
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
    const count = this.props.records.length
    const records = this.props.records.map((record, index) => {
      // @NOTE: new records will be prepended to the head of list
      // @NOTE: record's key here should be reversed, 
      // react use key to identify new items in list, 
      // and only re-render those items with different
      // key from previous rendering
      return (
        <div
          key={count - index}
          className={`record ${this.tagDiff(index)}`}
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
    return nextProps.shouldTagDiffs
      ? this.calculateDiff(preProps, nextProps)
      : -1
  }

  private calculateDiff(preProps: ISidebarListProps, nextProps: ISidebarListProps) {
    return nextProps.records.length - preProps.records.length
  }

  private tagDiff(index: number) {
    return index < this.state.diff ? 'record-diff' : ''
  }

  private shouldTagDiff(index: number) {
    return index < this.state.diff
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
    <div className="tags">
      {tags}
    </div>
  )
}

function createRecordLink(
  { scriptUrl, lineNumber, columnNumber },
  linkOnClicked: (e: any) => void
): JSX.Element {
  return (
    <div className="link">
      <a onClick={linkOnClicked.bind(null, scriptUrl, lineNumber)}>
        {`${scriptUrl}:${lineNumber}:${columnNumber}`}
      </a>
    </div>
  )
}

function createRecordInfo(record: ActionRecord): JSX.Element {
  return (
    <div className="info">
      <span>{record.source.code}</span>
    </div>
  )
}