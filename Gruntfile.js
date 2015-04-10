module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {livereload: true},
      css: {
        files: 'scss/main.css'
      },
      html: {
        files: '**/*.html'
      },
      js: {
        files: '**/*.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);


};