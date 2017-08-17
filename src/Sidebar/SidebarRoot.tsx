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
  isFilterUpdated: boolean;
}

export default class SidebarRoot extends React.Component<ISidebarRootProps, ISidebarRootState> {
  constructor(props) {
    super(props)

    this.state = {
      filter: ActionType.None,
      isFilterUpdated: false
    }
  }

  componentWillReceiveProps() {
    this.setState(() => {
      return {
        isFilterUpdated: false
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
        isFilterUpdated: true
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
          trackid={this.props.trackid}
          records={records}
          isFilterUpdated={this.state.isFilterUpdated}
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
