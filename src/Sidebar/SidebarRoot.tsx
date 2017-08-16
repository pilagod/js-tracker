/// <reference path='../tracker/ActionStore.d.ts'/>
/// <reference path='../tracker/TrackIDManager.d.ts'/>

import * as React from 'react'

import ActionType from '../tracker/ActionType'

import SidebarFilter from './SidebarFilter'
import SidebarList from './SidebarList'

export interface ISidebarRootProps {
  trackid: TrackID;
  records: ActionRecord[];
  openSource: (url: string, line: number) => void
}

interface ISidebarRootState {
  filter: number;
}

export default class SidebarRoot extends React.Component<ISidebarRootProps, ISidebarRootState> {
  constructor(props) {
    super(props)

    this.state = {
      filter: ActionType.None
    }
  }

  // @TODO: componentWillReceiveProps update onFilterUpdated

  updateFilter(
    action: 'add' | 'remove',
    filter: ActionType
  ) {
    this.setState((preState) => {
      return {
        filter: preState.filter + filter * (action === 'add' ? 1 : -1)
      }
    })
  }

  render() {
    const filteredRecords = this.props.records.filter((record) => {
      return this.state.filter === ActionType.None
        || this.state.filter & record.type
    })
    return (
      <div className="sidebar-root">
        <SidebarFilter
          filter={this.state.filter}
          updateFilter={this.updateFilter.bind(this)}
        />
        <SidebarList
          trackid={this.props.trackid}
          records={filteredRecords}
          openSource={this.props.openSource}
        />
      </div>
    )
  }
}
