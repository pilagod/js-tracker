const expect = require('chai').expect
const sinon = require('sinon')

before(() => {
  global.expect = expect
})

beforeEach(() => {
  global.sandbox = sinon.sandbox.create()
})

afterEach(() => {
  global.sandbox.restore()
})

after(() => {
  delete global.expect
  delete global.sandbox
})
