/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'

import ActionType from './tracker/ActionType'

import SidebarFilter from './SidebarFilter'
import SidebarList from './SidebarList'

interface ISidebarRootProps {
  // trackid
  // openResource
  records: ActionRecord[];
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
          records={filteredRecords}
          openResource={() => { }}
        />
      </div>
    )
  }
}
