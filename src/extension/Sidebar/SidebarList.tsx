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
  isRecordInDiffPeriod: { [key: string]: boolean };
}

export default class SidebarList extends React.Component<ISidebarListProps, ISidebarListState> {
  constructor(props) {
    super(props)

    this.state = {
      isRecordInDiffPeriod: {}
    }
  }

  componentWillReceiveProps(nextProps: ISidebarListProps) {
    // an index indicates new added record
    const diff = this.calculateDiff(this.props, nextProps)
    const newRecordsInDiffPeriod = {}

    nextProps.records.map((record, index) => {
      if (index < diff) {
        newRecordsInDiffPeriod[record.key] = true
      }
    })
    this.setState((preState: ISidebarListState) => {
      setTimeout(() => {
        this.setState((preState: ISidebarListState) => {
          const state = Object.assign({}, preState)

          Object.keys(newRecordsInDiffPeriod).map((key) => {
            delete state.isRecordInDiffPeriod[key]
          })
          return {
            isRecordInDiffPeriod: state.isRecordInDiffPeriod
          }
        })
      }, 2000)
      return {
        isRecordInDiffPeriod: Object.assign({}, preState.isRecordInDiffPeriod, newRecordsInDiffPeriod)
      }
    })
  }

  linkTo(url: string, line: number, e: Event) {
    e.preventDefault()
    this.props.openSource(url, line)
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

  private calculateDiff(preProps: ISidebarListProps, nextProps: ISidebarListProps) {
    return nextProps.shouldTagDiffs
      ? nextProps.records.length - preProps.records.length
      : -1
  }

  private shouldTagDiff(key: string) {
    return this.state.isRecordInDiffPeriod.hasOwnProperty(key)
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