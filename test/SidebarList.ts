/// <reference path='../src/tracker/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/ActionType'
import SidebarList from '../src/Sidebar/SidebarList'

const PORT = 9876
const HOST = `http://localhost:${PORT}`
const TEST_SCRIPT = HOST + '/test-script.js'

describe('SidebarList', () => {
  const _trackid = 'TRACK_ID_NOT_EXIST'
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

  it('should render all records passed to it', () => {
    const sidebarList = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarList, {
        trackid: _trackid,
        records: _records,
        openSource: () => { }
      })
    )
    const records = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarList,
      'record'
    )
    expect(records).to.have.length(_records.length)
    records.map((record, index) => {
      testRenderedRecordMatchesRecordData(record, _records[index])
    })
  })

  function testRenderedRecordMatchesRecordData(record: Element, data: ActionRecord) {
    const title = record.getElementsByClassName('record-title')
    const info = record.getElementsByClassName('record-info')

    expect(title).to.have.length(1)
    expect(info).to.have.length(1)

    testRenderedRecordTitle(title[0], data)
    testRenderedRecordInfo(info[0], data)
  }

  function testRenderedRecordTitle(title: Element, data: ActionRecord) {
    const tag = title.getElementsByClassName('record-tag')[0]
    const link = title.getElementsByClassName('record-link')[0]

    expect(tag.textContent).to.equal(ActionType[data.type])
    expect(link.textContent).to.equal(data.key)
  }

  function testRenderedRecordInfo(info: Element, data: ActionRecord) {
    expect(info.textContent).to.equal(data.source.code)
  }

  it('should call prop openSource with proper url and line number when record link is clicked', () => {
    const openSourceSpy = sinon.spy()
    const sidebarList = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarList, {
        trackid: _trackid,
        records: _records,
        openSource: openSourceSpy
      })
    )
    const links = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarList,
      'record-link'
    )
    links.map((link, index) => {
      const record = _records[index]

      ReactTestUtils.Simulate.click(link)

      expect(
        openSourceSpy.calledWith(
          record.source.loc.scriptUrl,
          record.source.loc.lineNumber
        )
      ).to.be.true
    })
  })

  it('should add class record-diff to new records given records updated but not trackid', () => {
    class SidebarListWrapper extends React.Component {
      constructor(props) {
        super(props)
        this.state = Object.assign({}, this.props)
      }
      render() {
        return React.createElement(SidebarList, this.state)
      }
    }
    const sidebarListWrapper = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarListWrapper, {
        trackid: '1',
        records: _records.slice(_records.length - 1),
        openSource: () => { }
      })
    )
    sidebarListWrapper.setState({
      trackid: '1',
      records: _records
    })
    const diffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record-diff'
    )
    expect(diffs).to.have.length(2)
  })
})