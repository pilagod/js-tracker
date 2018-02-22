/// <reference path='../../../src/extension/private/types/ActionRecordStore.d.ts'/> 

import { expect } from 'chai'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../../../src/tracker/public/ActionType'
import SidebarRoot from '../../../src/extension/Sidebar/SidebarRoot'
import SidebarFilter from '../../../src/extension/Sidebar/SidebarFilter'
import SidebarList from '../../../src/extension/Sidebar/SidebarList'

import wrapperFactory from './wrapperFactory'
import { actionsOfJS as actions } from '../../actions'

describe('SidebarRoot', () => {
  const SidebarRootWrapper = wrapperFactory(SidebarRoot)

  const _records: ActionRecord[] = [
    actions[0].record, // Attr
    actions[1].record, // Style
    actions[2].record // Style
  ]
  const _openSource = () => { }

  let sidebarRootWrapper, sidebarFilter, sidebarList

  beforeEach(() => {
    sidebarRootWrapper = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarRootWrapper, {
        records: _records,
        shouldTagDiffs: false,
        openSource: _openSource
      })
    )
    sidebarFilter = ReactTestUtils.findRenderedComponentWithType(
      sidebarRootWrapper,
      SidebarFilter
    )
    sidebarList = ReactTestUtils.findRenderedComponentWithType(
      sidebarRootWrapper,
      SidebarList
    )
  })

  it('should send its state\'s filter and updateFilter function as prop to SidebarFilter', () => {
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
    expect(sidebarFilter.props.updateFilter).to.be.a('function')
  })

  it('should send records, shouldTagDiffs and openSource function as prop to SidebarList', () => {
    expect(sidebarList.props.records).to.deep.equal(_records)
    expect(sidebarList.props.shouldTagDiffs).to.be.false
    expect(sidebarList.props.openSource).to.equal(_openSource)
  })

  it('should send new filter updated by updateFilter to SidebarFilter', () => {
    const updateFilter = sidebarFilter.props.updateFilter

    updateFilter('set', ActionType.Attr)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Attr)

    updateFilter('set', ActionType.Style)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Style)

    updateFilter('unset', ActionType.Style)
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
  })

  it('should send filtered records and false shouldTagDiffs to SidebarList when updateFilter function is called', () => {
    const updateFilter = sidebarFilter.props.updateFilter
    // filter updating should not tag diffs in SidebarList
    sidebarRootWrapper.setState({
      shouldTagDiffs: true
    })
    updateFilter('set', ActionType.Attr)
    expect(sidebarList.props.records).to.deep.equal(_records.slice(0, 1))
    expect(sidebarList.props.shouldTagDiffs).to.be.false

    updateFilter('set', ActionType.Style)
    expect(sidebarList.props.records).to.deep.equal(_records.slice(1, 3))
    expect(sidebarList.props.shouldTagDiffs).to.be.false

    updateFilter('unset', ActionType.Style)
    expect(sidebarList.props.records).to.deep.equal(_records)
    expect(sidebarList.props.shouldTagDiffs).to.be.false
  })
})