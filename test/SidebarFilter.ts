import { expect } from 'chai'
import * as sinon from 'sinon'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/ActionType'
import SidebarFilter from '../src/SidebarFilter'

describe('SidebarFilter', () => {
  it('should render each action type as a button, with name, value and text set properly', () => {
    const sidebarFilter = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarFilter, {
        filter: 0,
        updateFilter: () => { }
      })
    )
    const buttons = <HTMLButtonElement[]>ReactTestUtils.scryRenderedDOMComponentsWithTag(
      sidebarFilter,
      'button'
    )
    const totalTypes = (Object.keys(ActionType).length / 2) - 1 // exclude None
    const totalTypesInButtons = buttons.reduce((set, button) => {
      expect(ActionType).to.have.property(button.name)
      expect(button.value).to.equal(ActionType[button.name].toString())
      expect(button.textContent).to.equal(button.name)
      expect(button.classList.contains('filter')).to.be.true

      return set.add(button.name)
    }, new Set()).size
    // ensure these buttons cover all ActionTypes
    expect(totalTypesInButtons).to.equal(totalTypes)
  })

  it('should add \'selected\' class to button whose value is equal to filter (single filter scenario)', () => {
    const sidebarFilter = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarFilter, {
        filter: ActionType.Attr,
        updateFilter: () => { }
      })
    )
    const button = <HTMLButtonElement>ReactTestUtils.findRenderedDOMComponentWithClass(
      sidebarFilter,
      'selected'
    )
    expect(button.name).to.equal('Attr')
  })

  it('should add \'selected\' class to those buttons whose values sum up to filter (multiple filters scenario)', () => {
    const compositeFilter =
      ActionType.Attr
      | ActionType.Node
      | ActionType.Style
    const sidebarCompositeFilter = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarFilter, {
        filter: compositeFilter,
        updateFilter: () => { }
      })
    )
    const buttons = <HTMLButtonElement[]>ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarCompositeFilter,
      'selected'
    )
    expect(buttons).to.have.length(3)
    expect(
      buttons.reduce((filter, button) => {
        return filter - ActionType[button.name]
      }, compositeFilter)
    ).to.equal(0)
  })

  it('should call prop updateFilter with action \'add\' and proper filter when button is clicked, given that button is not selected', () => {
    const updateFilter = sinon.spy()
    const sidebarFilter = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarFilter, {
        filter: ActionType.Style,
        updateFilter: updateFilter
      })
    )
    const attrButton = <HTMLButtonElement>ReactTestUtils.scryRenderedDOMComponentsWithTag(
      sidebarFilter,
      'button'
    ).filter((button: HTMLButtonElement) => {
      return button.name === 'Attr'
    })[0]

    ReactTestUtils.Simulate.click(attrButton)

    expect(
      updateFilter.calledWith('add', ActionType.Attr)
    ).to.be.true
  })

  it('should call prop updateFilter with action \'remove\' and proper filter when button is clicked, given that button is selected ', () => {
    const updateFilter = sinon.spy()
    const sidebarFilter = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarFilter, {
        filter: ActionType.Style,
        updateFilter: updateFilter
      })
    )
    const styleButton = <HTMLButtonElement>ReactTestUtils.findRenderedDOMComponentWithClass(
      sidebarFilter,
      'selected'
    )

    ReactTestUtils.Simulate.click(styleButton)

    expect(
      updateFilter.calledWith('remove', ActionType.Style)
    ).to.be.true
  })
})
