module.exports = function (grunt) {
  grunt.initConfig({
    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage',
        dryRun: false,
        force: true,
        recursive: true
      }
    }
  })
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-karma-coveralls')
  // Default task(s).
  grunt.registerTask('default', ['coveralls'])
}
