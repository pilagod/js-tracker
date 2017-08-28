import { expect } from 'chai'
import * as sinon from 'sinon'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/public/ActionType'

import SidebarFilter from '../src/extension/Sidebar/SidebarFilter'

import utils from './utils'

describe('SidebarFilter', () => {
  const SidebarFilterWrapper = utils.wrapperFactory(SidebarFilter)

  const _filter = ActionType.None
  const _updateFilter = () => { }

  let sidebarFilterWrapper

  beforeEach(() => {
    sidebarFilterWrapper = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarFilterWrapper, {
        filter: _filter,
        updateFilter: _updateFilter
      })
    )
  })

  it('should render each action type as a button, with name, value and text set properly', () => {
    const buttons = <HTMLButtonElement[]>ReactTestUtils.scryRenderedDOMComponentsWithTag(
      sidebarFilterWrapper,
      'button'
    )
    const totalTypes = (Object.keys(ActionType).length / 2) - 1 // excluding ActionType.None
    const totalTypesInButtons = buttons.reduce((set, button) => {
      expect(button.value).to.equal(ActionType[button.name].toString())
      expect(button.textContent).to.equal(button.name)
      expect(button.classList.contains('tag')).to.be.true
      expect(button.classList.contains('tag-filter')).to.be.true
      expect(button.classList.contains(`tag-${button.name.toLowerCase()}`)).to.be.true

      return set.add(button.name)
    }, new Set()).size
    // ensure these buttons cover all ActionTypes
    expect(totalTypesInButtons).to.equal(totalTypes)
  })

  it('should add \'selected\' class to button whose value is equal to filter (single filter scenario)', () => {
    sidebarFilterWrapper.setState({
      filter: ActionType.Attr
    })
    const button = <HTMLButtonElement>ReactTestUtils.findRenderedDOMComponentWithClass(
      sidebarFilterWrapper,
      'selected'
    )
    expect(button.name).to.equal('Attr')
  })

  it('should call prop updateFilter with action \'set\' and corresponding filter when button is clicked, given that button is not selected', () => {
    const updateFilterSpy = sinon.spy()

    sidebarFilterWrapper.setState({
      filter: ActionType.Style,
      updateFilter: updateFilterSpy
    })
    const attrButton = <HTMLButtonElement>ReactTestUtils.scryRenderedDOMComponentsWithTag(
      sidebarFilterWrapper,
      'button'
    ).filter((button) => {
      return (button as HTMLButtonElement).name === 'Attr'
    })[0]

    ReactTestUtils.Simulate.click(attrButton)

    expect(
      updateFilterSpy.calledWith('set', ActionType.Attr)
    ).to.be.true
  })

  it('should call prop updateFilter with action \'unset\' and corresponding filter when button is clicked, given that button is selected ', () => {
    const updateFilterSpy = sinon.spy()

    sidebarFilterWrapper.setState({
      filter: ActionType.Style,
      updateFilter: updateFilterSpy
    })
    const styleButton = <HTMLButtonElement>ReactTestUtils.findRenderedDOMComponentWithClass(
      sidebarFilterWrapper,
      'selected'
    )
    ReactTestUtils.Simulate.click(styleButton)

    expect(
      updateFilterSpy.calledWith('unset', ActionType.Style)
    ).to.be.true
  })
})
