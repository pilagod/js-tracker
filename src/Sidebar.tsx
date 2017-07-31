/// <reference path='./tracker/ActionStore.d.ts'/>

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import ActionType from './tracker/ActionType'

/**
 * Sidebar Root
 */

interface ISidebarRootProps {
  records: ActionRecord[];
}

interface ISidebarRootState {
  filter: number;
}

class SidebarRoot extends React.Component<ISidebarRootProps, ISidebarRootState> {
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

/**
 * Sidebar Filter
 */

interface ISidebarFilterProps {
  filter: number;
  updateFilter: (
    action: 'add' | 'remove',
    filter: ActionType
  ) => void;
}

interface ISidebarFilterState {
  filterButtons: JSX.Element[];
}

class SidebarFilter extends React.Component<ISidebarFilterProps, ISidebarFilterState> {
  // background: #F4F4F4
  constructor(props) {
    super(props)

    this.state = {
      filterButtons: this._createFilterButtons()
    }
  }

  _createFilterButtons(): JSX.Element[] {
    const onFilterClicked = this.onFilterClicked.bind(this)

    return Object.keys(ActionType)
      .filter((type) => {
        // @NOTE: typescript enum has both name and value key,
        // name key passing through parseInt will return NaN
        return isNaN(parseInt(type)) && (type !== 'None')
      })
      .map((type, index) => {
        return (
          <button key={index} value={ActionType[type]} onClick={onFilterClicked}>
            {type.toLowerCase()}
          </button>
        )
      })
  }

  onFilterClicked(e) {
    e.preventDefault()

    const button: HTMLButtonElement = e.target
    const action =
      button.classList.contains('selected') ? 'remove' : 'add'

    button.classList[action]('selected')
    this.props.updateFilter(action, parseInt(button.value, 10))
  }

  render() {
    return (
      <div className="sidebar-filter">
        {this.state.filterButtons}
      </div>
    )
  }
}

/**
 * Sidebar  List
 */

class SidebarList extends React.Component {
  // @TODO: add tooltip to link
  constructor(props) {
    super(props)
  }
  // open(url: string, lineNumber: number, e: Event) {
  //   e.preventDefault()
  //   chrome.devtools.panels.openResource(url, lineNumber - 1, () => { })
  // }
  render() {
    return (
      <div className="sidebar-list"></div>
    )
  }
}

const Sidebar = {
  render(container: Element, records: ActionRecord[] = []): void {
    ReactDOM.render(
      <SidebarRoot records={records} />,
      container
    )
  }
}
export default Sidebar
