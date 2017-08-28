/// <reference path='../src/tracker/public/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/public/ActionType'

import SidebarRoot from '../src/extension/Sidebar/SidebarRoot'
import SidebarFilter from '../src/extension/Sidebar/SidebarFilter'
import SidebarList from '../src/extension/Sidebar/SidebarList'

import utils from './utils'
import actions from './test-script-actions'

describe('SidebarRoot', () => {
  const SidebarRootWrapper = utils.wrapperFactory(SidebarRoot)

  const _trackid = '1'
  const _records: ActionRecord[] = [
    actions[0].record,
    actions[1].record,
    actions[2].record
  ]
  const _openSource = () => { }

  let sidebarRootWrapper, sidebarFilter, sidebarList

  beforeEach(() => {
    sidebarRootWrapper = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarRootWrapper, {
        trackid: _trackid,
        records: _records,
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

  it('should send its state\'s filter and update filter function as prop to SidebarFilter', () => {
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
    expect(sidebarFilter.props.updateFilter).to.be.a('function')
  })

  it('should send trackid, records, isFilterUpdated (default: false) and openSource function as prop to SidebarList', () => {
    expect(sidebarList.props.trackid).to.equal(_trackid)
    expect(sidebarList.props.records).to.deep.equal(_records)
    expect(sidebarList.props.isFilterUpdated).to.be.false
    expect(sidebarList.props.openSource).to.equal(_openSource)
  })

  it('should update its state\'s filter and isFilterUpdated by update filter function sent to SidebarFilter', () => {
    const updateFilter = sidebarFilter.props.updateFilter

    updateFilter('set', ActionType.Attr)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Attr)
    expect(sidebarList.props.isFilterUpdated).to.be.true

    updateFilter('set', ActionType.Style)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Style)
    expect(sidebarList.props.isFilterUpdated).to.be.true

    updateFilter('unset', ActionType.Style)
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
    expect(sidebarList.props.isFilterUpdated).to.be.true
  })

  it('should filter records by its state\'s filter and send result as records prop to SidebarList', () => {
    const updateFilter = sidebarFilter.props.updateFilter

    updateFilter('set', ActionType.Attr)
    expect(sidebarList.props.records).to.deep.equal(_records.slice(0, 1))
    expect(sidebarList.props.isFilterUpdated).to.be.true

    updateFilter('set', ActionType.Style)
    expect(sidebarList.props.records).to.deep.equal(_records.slice(1, 3))
    expect(sidebarList.props.isFilterUpdated).to.be.true

    updateFilter('unset', ActionType.Style)
    expect(sidebarList.props.records).to.deep.equal(_records)
    expect(sidebarList.props.isFilterUpdated).to.be.true
  })

  it('should set its isFilterUpdated to false given prop records updated', () => {
    const updateFilter = sidebarFilter.props.updateFilter

    // set filter
    updateFilter('set', ActionType.Attr)
    expect(sidebarList.props.isFilterUpdated).to.be.true

    // update records only
    sidebarRootWrapper.setState({
      records: [].concat(_records, actions[3].record)
    })
    expect(sidebarList.props.isFilterUpdated).to.be.false

    // set filter
    updateFilter('set', ActionType.Style)
    expect(sidebarList.props.isFilterUpdated).to.be.true

    // update trackid and records
    sidebarRootWrapper.setState({
      trackid: '2',
      records: []
    })
    expect(sidebarList.props.isFilterUpdated).to.be.false
  })
})