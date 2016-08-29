describe('checkerDispatcher tests', () => {
  let checkerDispatcher

  before(() => {
    checkerDispatcher = require(`${libDir}/dispatchers/checkerDispatcher`)
  })

  it('should import all other handlers in /dispatchers', () => {
    const path = `${__dirname}/${libDir}/dispatchers`
    const handlers = importAllFrom(path, {file: false})

    expect(checkerDispatcher.handlers).to.be.eql(handlers)
  })

  it('should return true when test called', () => {
    const result = checkerDispatcher.test()

    expect(result).to.be.true
  })
})
