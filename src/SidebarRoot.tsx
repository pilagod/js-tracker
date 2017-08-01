/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'

import ActionType from './tracker/ActionType'

import SidebarFilter from './SidebarFilter'
import SidebarList from './SidebarList'

interface ISidebarRootProps {
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
      console.log(preState.filter + filter * (action === 'add' ? 1 : -1))
      return {
        filter: preState.filter + filter * (action === 'add' ? 1 : -1)
      }
    })
  }

  render() {
    return (
      <div className="sidebar-root">
        <SidebarFilter
          filter={this.state.filter}
          updateFilter={this.updateFilter.bind(this)}
        />
        <SidebarList />
      </div>
    )
  }
}
