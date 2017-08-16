/// <reference path='../src/tracker/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/ActionType'
import SidebarList from '../src/Sidebar/SidebarList'
import { Track_ID_Does_Not_Exist } from '../src/tracker/TrackIDManager'

import actions from './test-script-actions'

describe.only('SidebarList', () => {
  const _trackid = Track_ID_Does_Not_Exist
  const _records: ActionRecord[] = [
    actions[0].record,
    actions[1].record,
    actions[2].record
  ]
  it('should render all records, with single type, passed to it properly', () => {
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
      const _record = _records[index]

      const tag = record.getElementsByClassName('record-tag')
      const link = record.getElementsByClassName('record-link')
      const info = record.getElementsByClassName('record-info')

      expect(tag).to.have.length(1)
      expect(link).to.have.length(1)
      expect(info).to.have.length(1)

      // record-tag

      const tags = tag[0].getElementsByClassName('tag')
      const type = ActionType[_record.type]

      expect(tags).to.have.length(1)
      expect(tags[0].classList.contains(`tag-${type.toLowerCase()}`)).to.be.true
      expect(tags[0].textContent).to.equal(type)

      // record-link

      expect(link[0].textContent).to.equal(_record.key)

      // record-info

      expect(info[0].textContent).to.equal(_record.source.code)
    })
  })

  it('should render record with composite type properly', () => {
    const sidebarList = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarList, {
        trackid: _trackid,
        records: [actions[3].record]
      })
    )
    const records = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarList,
      'record'
    )
    expect(records).to.have.length(1)

    const tags =
      records[0]
        .getElementsByClassName('record-tag')[0]
        .getElementsByClassName('tag')

    expect(tags).to.have.length(2)

    expect(tags[0].classList.contains('tag-attr')).to.be.true
    expect(tags[0].textContent).to.equal('Attr')

    expect(tags[1].classList.contains('tag-node')).to.be.true
    expect(tags[1].textContent).to.equal('Node')
  })

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

  it('should add class record-diff to new records given records is updated but not the trackid', () => {
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

    // should add record-diff class to new records
    sidebarListWrapper.setState({
      trackid: '1',
      records: _records
    })
    const diffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record-diff'
    )
    expect(diffs).to.have.length(2)

    // should not add record-diff class when trackid is changed
    sidebarListWrapper.setState({
      trackid: '2',
      records: _records
    })
    const noDiffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record-diff'
    )
    expect(noDiffs).to.have.length(0)
  })
})