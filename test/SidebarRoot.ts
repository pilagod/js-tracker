/// <reference path='../src/tracker/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/ActionType'
import SidebarRoot from '../src/SidebarRoot'
import SidebarFilter from '../src/SidebarFilter'
import SidebarList from '../src/SidebarList'

const PORT = 9876
const HOST = `http://localhost:${PORT}`
const TEST_SCRIPT = HOST + '/test-script.js'

// @TODO: trackid, openResource to sidebarlist

describe('SidebarRoot', () => {
  const _records: ActionRecord[] = []

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

  it('should send its state\'s filter and filter updater as prop to SidebarFilter', () => {
    const sidebarRoot = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarRoot, {
        records: _records
      })
    )
    const sidebarFilter = ReactTestUtils.findRenderedComponentWithType(
      sidebarRoot,
      SidebarFilter
    )
    expect(sidebarFilter.props.filter).to.equal(ActionType.None)
    expect(sidebarFilter.props.updateFilter).to.be.a('function')

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

  it('should send records filtered by state\'s filter to SidebarList', () => {
    const sidebarRoot = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarRoot, {
        records: _records
      })
    )
    const sidebarList = ReactTestUtils.findRenderedComponentWithType(
      sidebarRoot,
      SidebarList
    )
    expect(sidebarList.props.records).to.deep.equal(_records)

    const sidebarFilter = ReactTestUtils.findRenderedComponentWithType(
      sidebarRoot,
      SidebarFilter
    )
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