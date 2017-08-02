/// <reference path='./tracker/ActionType.d.ts'/>

import * as React from 'react'

import ActionType from './tracker/ActionType'

interface ISidebarFilterProps {
  filter: number;
  updateFilter: (
    action: 'add' | 'remove',
    filter: ActionType
  ) => void;
}

export default class SidebarFilter extends React.Component<ISidebarFilterProps> {
  private filterTypes: string[]
  private onFilterClicked: (e: any) => void

  // background: #F4F4F4
  constructor(props) {
    super(props)

    this.filterTypes = Object.keys(ActionType).filter((type) => {
      // @NOTE: typescript enum has both name and value key,
      // name key passing through parseInt will return NaN
      return isNaN(parseInt(type)) && type !== 'None'
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
          name={type}
          value={filter}
          className={`filter ${selected}`}
          onClick={this.onFilterClicked}
        >
          {type}
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