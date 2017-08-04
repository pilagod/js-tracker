/// <reference path='../src/tracker/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/ActionType'
import SidebarRoot from '../src/Sidebar/SidebarRoot'
import SidebarFilter from '../src/Sidebar/SidebarFilter'
import SidebarList from '../src/Sidebar/SidebarList'

const PORT = 9876
const HOST = `http://localhost:${PORT}`
const TEST_SCRIPT = HOST + '/test-script.js'

describe('SidebarRoot', () => {
  const _trackid = '1'
  const _records: ActionRecord[] = []
  const _openSource = () => { }

  let sidebarRoot, sidebarFilter, sidebarList

  before(() => {
    // refer to ./test-script.js
    _records.push(<ActionRecord>{
      key: TEST_SCRIPT + ':2:1',
      type: ActionType.Attr,
      source: <Source>{
        loc: {
          scriptUrl: TEST_SCRIPT,
          lineNumber: 2,
          columnNumber: 1
        },
        code: `div.id = 'id'`
      }
    })
    _records.push(<ActionRecord>{
      key: TEST_SCRIPT + ':3:1',
      type: ActionType.Style,
      source: <Source>{
        loc: {
          scriptUrl: TEST_SCRIPT,
          lineNumber: 3,
          columnNumber: 1
        },
        code: `div.style.color = 'red'`
      }
    })
    _records.push(<ActionRecord>{
      key: TEST_SCRIPT + ':4:1',
      type: ActionType.Style,
      source: <Source>{
        loc: {
          scriptUrl: TEST_SCRIPT,
          lineNumber: 4,
          columnNumber: 1
        },
        code: `div.removeAttribute('style')`
      }
    })
  })

  beforeEach(() => {
    sidebarRoot = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarRoot, {
        trackid: _trackid,
        records: _records,
        openSource: _openSource
      })
    )
    sidebarFilter = ReactTestUtils.findRenderedComponentWithType(
      sidebarRoot,
      SidebarFilter
    )
    sidebarList = ReactTestUtils.findRenderedComponentWithType(
      sidebarRoot,
      SidebarList
    )
  })

  it('should send its state\'s filter and update filter function as prop to SidebarFilter', () => {
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
    expect(sidebarFilter.props.updateFilter).to.be.a('function')
  })

  it('should update its state\'s filter by update filter function sent to SidebarFilter', () => {
    const updateFilter = sidebarFilter.props.updateFilter

    updateFilter('add', ActionType.Attr)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Attr)

    updateFilter('add', ActionType.Style)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Attr | ActionType.Style)

    updateFilter('remove', ActionType.Attr)
    expect(sidebarFilter.props.filter).to.equal(ActionType.Style)

    updateFilter('remove', ActionType.Style)
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
  })

  it('should send trackid, records, and openSource function as prop to SidebarList', () => {
    expect(sidebarList.props.trackid).to.equal(_trackid)
    expect(sidebarList.props.records).to.deep.equal(_records)
    expect(sidebarList.props.openSource).to.equal(_openSource)
  })

  it('should filter records by its state\'s filter and send result as records prop to SidebarList', () => {
    const updateFilter = sidebarFilter.props.updateFilter

    updateFilter('add', ActionType.Attr)
    expect(sidebarList.props.records).to.deep.equal(_records.slice(0, 1))

    updateFilter('add', ActionType.Style)
    expect(sidebarList.props.records).to.deep.equal(_records)

    updateFilter('remove', ActionType.Attr)
    expect(sidebarList.props.records).to.deep.equal(_records.slice(1, 3))

    updateFilter('remove', ActionType.Style)
    expect(sidebarList.props.records).to.deep.equal(_records)
  })
})