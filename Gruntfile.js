module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jasmine : {
      src : 'src/**/*.js',
      options : {
        specs    : 'spec/**/*.js',
        template : 'SpecRunner.html',
        vendor   : [
          'bower_components/jquery/dist/jquery.js'
        ]
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['test']);
};
