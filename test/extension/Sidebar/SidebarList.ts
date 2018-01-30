/// <reference path='../../../src/tracker/types/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../../../src/tracker/public/ActionType'
import SidebarList from '../../../src/extension/Sidebar/SidebarList'

import wrapperFactory from './wrapperFactory'
import { actionsOfJS as actions } from '../../actions'

describe('SidebarList', () => {
  const DIFF_STATE_DURATION = SidebarList.DIFF_STATE_DURATION
  const SidebarListWrapper = wrapperFactory(SidebarList)

  const _records: ActionRecord[] = [
    actions[0].record,
    actions[1].record,
    actions[2].record
  ]
  let sidebarListWrapper

  beforeEach(() => {
    // @NOTE: set state of sidebarListWrapper in each test case 
    // might trigger component lifecycle function 
    sidebarListWrapper = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarListWrapper, {
        records: _records,
        shouldTagDiffs: false,
        openSource: () => { }
      })
    )
  })

  it('should render all records passed to it properly', () => {
    const records = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record'
    )
    expect(records).to.have.length(_records.length)

    records.map((record, index) => {
      const _record = _records[index]

      const tag = record.getElementsByClassName('tags')
      const link = record.getElementsByClassName('link')
      const info = record.getElementsByClassName('info')

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

      const alink = link[0].getElementsByTagName('a')
      const { scriptUrl, lineNumber, columnNumber } = _record.loc

      expect(alink).to.have.length(1)
      expect(alink[0].textContent).to.equal(`${scriptUrl}:${lineNumber}:${columnNumber}`)

      // record-info

      expect(info[0].textContent).to.equal(_record.code)
    })
  })

  it('should render record with composite type properly', () => {
    sidebarListWrapper.setState({
      records: [actions[3].record]
    })
    const records = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record'
    )
    expect(records).to.have.length(1)

    const tags =
      records[0]
        .getElementsByClassName('tags')[0]
        .getElementsByClassName('tag')

    expect(tags).to.have.length(2)

    expect(tags[0].classList.contains('tag-attr')).to.be.true
    expect(tags[0].textContent).to.equal('Attr')

    expect(tags[1].classList.contains('tag-node')).to.be.true
    expect(tags[1].textContent).to.equal('Node')
  })

  it('should call prop openSource with proper url and line number when record links are clicked', () => {
    const openSourceSpy = sinon.spy()

    sidebarListWrapper.setState({
      openSource: openSourceSpy
    })
    const links = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'link'
    )
    links.map((link, index) => {
      const alink = link.getElementsByTagName('a')[0]
      const {
        scriptUrl,
        lineNumber
      } = _records[index].loc

      ReactTestUtils.Simulate.click(alink)

      expect(
        openSourceSpy.calledWith(scriptUrl, lineNumber)
      ).to.be.true
    })
  })

  it('should add class record-diff to new records given shouldTagDiffs is true', () => {
    sidebarListWrapper.setState({
      records: [].concat(_records, actions[3].record),
      shouldTagDiffs: true
    })
    const diffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record-diff'
    )
    expect(diffs).to.have.length(1)
  })

  it('should not add class record-diff to any record given shouldTagDiffs is false', () => {
    sidebarListWrapper.setState({
      records: [].concat(_records, actions[3].record),
      shouldTagDiffs: false
    })
    const diffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record-diff'
    )
    expect(diffs).to.have.length(0)
  })

  it('should keep record-diff on records when diff state hasn\'t finished', () => {
    sidebarListWrapper.setState({
      records: [],
      shouldTagDiffs: false
    })
    sidebarListWrapper.setState({
      records: [actions[0].record],
      shouldTagDiffs: true
    })
    sidebarListWrapper.setState({
      records: [
        actions[1].record,
        actions[0].record,
      ],
      shouldTagDiffs: true
    })
    const diffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarListWrapper,
      'record-diff'
    )
    expect(diffs).to.have.length(2)
  })

  it('should remove record-diff on records when diff state has finished', (done) => {
    sidebarListWrapper.setState({
      records: [
        actions[1].record,
        actions[0].record,
      ],
      shouldTagDiffs: true
    })
    setTimeout(() => {
      const diffs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        sidebarListWrapper,
        'record-diff'
      )
      expect(diffs).to.have.length(0)
      done()
    }, DIFF_STATE_DURATION)
  })

  it('should render \'Have no matched records yet :)\' notification given no records', () => {
    sidebarListWrapper.setState({
      records: []
    })
    const record = ReactTestUtils.findRenderedDOMComponentWithClass(
      sidebarListWrapper,
      'record'
    )
    expect(record.classList.contains('record-empty')).to.be.true
    expect(record.textContent).to.equal('Have no matched records yet :)')
  })
})