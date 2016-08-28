describe('checkerDispatcher tests', () => {
  const importAllFrom = require('import-all-from')
  let checkerDispatcher

  before(() => {
    checkerDispatcher = require(`${libDir}/dispatchers/checkerDispatcher`)
  })

  it('should import all other handlers in /EsprimaParser/dispatchers', () => {
    const handlers = importAllFrom(`${__dirname}/${libDir}/dispatchers`, {file: false})

    expect(checkerDispatcher.handlers).to.be.eql(handlers)
  })

  it('should set test to a function which always returns true', () => {
    const result = checkerDispatcher.test()

    expect(result).to.be.true
  })
})
