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

class SidebarFilter extends React.Component<ISidebarFilterProps> {
  private filterTypes: string[]
  private onFilterClicked: (e: any) => void

  // background: #F4F4F4
  constructor(props) {
    super(props)

    this.filterTypes = Object.keys(ActionType).filter((type) => {
      // @NOTE: typescript enum has both name and value key,
      // name key passing through parseInt will return NaN
      return isNaN(parseInt(type)) && (type !== 'None')
    })
    this.onFilterClicked = this._onFilterClicked.bind(this)
  }

  private _onFilterClicked(e) {
    e.preventDefault()

    const button: HTMLButtonElement = e.target
    const action = button.classList.contains('selected') ? 'remove' : 'add'
    const filter = parseInt(button.value, 10)

    this.props.updateFilter(action, filter)
  }

  render() {
    const filterButtons = this.filterTypes.map((type, index) => {
      const filter = ActionType[type]
      const selected = (this.props.filter & filter) ? 'selected' : ''

      return (
        <button
          key={index}
          value={filter}
          className={selected}
          onClick={this.onFilterClicked}
        >
          {type.toLowerCase()}
        </button>
      )
    })
    return (
      <div className="sidebar-filter">
        {filterButtons}
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
