/// <reference path='../../tracker/types/ActionStore.d.ts'/>

import * as React from 'react'

import ActionType from '../../tracker/public/ActionType'

import SidebarFilter from './SidebarFilter'
import SidebarList from './SidebarList'

export interface ISidebarRootProps {
  records: ActionRecord[];
  shouldTagDiffs: boolean;
  openSource: (url: string, line: number) => void
}

interface ISidebarRootState {
  filter: number;
  shouldTagDiffs: boolean;
}

export default class SidebarRoot extends React.Component<ISidebarRootProps, ISidebarRootState> {
  constructor(props) {
    super(props)

    this.state = {
      filter: ActionType.None,
      shouldTagDiffs: this.props.shouldTagDiffs
    }
  }

  componentWillReceiveProps(nextProps: ISidebarRootProps) {
    this.setState(() => {
      return {
        shouldTagDiffs: nextProps.shouldTagDiffs
      }
    })
  }

  updateFilter(
    action: 'set' | 'unset',
    filter: ActionType
  ) {
    this.setState((preState) => {
      return {
        filter: action === 'set' ? filter : ActionType.None,
        shouldTagDiffs: false
      }
    })
  }

  render() {
    const records = this.filterRecords(this.props.records)

    return (
      <div className="sidebar-root">
        <SidebarFilter
          filter={this.state.filter}
          updateFilter={this.updateFilter.bind(this)}
        />
        <SidebarList
          records={records}
          shouldTagDiffs={this.state.shouldTagDiffs}
          openSource={this.props.openSource}
        />
      </div>
    )
  }

  /* private */

  private filterRecords(records) {
    return records.filter((record) => {
      return this.state.filter === ActionType.None
        || this.state.filter & record.type
    })
  }
}
