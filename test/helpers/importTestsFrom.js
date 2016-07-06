const fs = require('fs')
const testFileRegExp = /-test.js$/

module.exports = (pathFromRoot) => {
  const pathFromHere = pathFromRoot.replace(/((\w|\.)+\/){2}/, '../')
  const testFilesOrDirs = fs.readdirSync(pathFromRoot);

  testFilesOrDirs.forEach((fileOrDir) => {
    const testPathFromRoot = pathFromRoot + fileOrDir;
    if (fs.statSync(testPathFromRoot).isFile() && testFileRegExp.test(fileOrDir)) {
      require(`${pathFromHere}fileOrDir`)
    }
  })
}
