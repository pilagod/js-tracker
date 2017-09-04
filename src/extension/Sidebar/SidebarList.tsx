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
  recordsInDiffState: { [key: string]: boolean; };
}

export default class SidebarList extends React.Component<ISidebarListProps, ISidebarListState> {
  constructor(props) {
    super(props)

    this.state = {
      recordsInDiffState: {}
    }
  }

  componentWillReceiveProps(nextProps: ISidebarListProps) {
    const diffs = this.filterDiffRecords(this.props, nextProps)

    this.setDiffStateTo(diffs)

    setTimeout(() => {
      this.clearDiffStateOf(diffs)
    }, this.DIFF_STATE_DURATION)
  }

  render() {
    const records = this.props.records.map((record, index) => {
      // @NOTE: new records will be prepended to the head of list
      // @NOTE: key should reflect new added items,
      // react use key to identify new items in list, 
      // and only re-render those items with new key 
      // from previous rendering
      return (
        <div
          key={record.key}
          className={`record ${this.shouldTagDiff(record.key) ? 'record-diff' : ''}`}
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

  private DIFF_STATE_DURATION = 2000

  private linkTo(url: string, line: number, e: Event) {
    e.preventDefault()
    this.props.openSource(url, line)
  }

  private shouldTagDiff(key: string) {
    return this.state.recordsInDiffState.hasOwnProperty(key)
  }

  private filterDiffRecords(preProps: ISidebarListProps, nextProps: ISidebarListProps) {
    if (nextProps.shouldTagDiffs) {
      // @NOTE: new records will always be added to the head of record list
      const lastDiffIndex
        = nextProps.records.length - preProps.records.length

      return nextProps.records.filter((_, index) => index < lastDiffIndex)
    }
    return []
  }

  private setDiffStateTo(records: ActionRecord[]) {
    this.setState((preState: ISidebarListState) => {
      return {
        recordsInDiffState: Object.assign({},
          preState.recordsInDiffState,
          records.reduce((_, record) => {
            return Object.assign(_, { [record.key]: true })
          }, {})
        )
      }
    })
  }

  private clearDiffStateOf(records: ActionRecord[]) {
    this.setState((preState: ISidebarListState) => {
      const nextState = Object.assign({}, preState)

      records.map((record) => {
        delete nextState.recordsInDiffState[record.key]
      })
      return nextState
    })
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