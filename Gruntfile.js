module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-umd']
      },
      dist: {
        files: [{
          expand: true,
          src: ['src/**/*.js'],
          dest: 'tmp'
        }]
      }
    },
    clean: ['tmp/src'],
    concat: {
      options: {
        sourceMap: true
      },
      js: {
        src: [
          'tmp/src/doc.js',
          'tmp/src/utils/**/*.js',
          'tmp/src/validate.js',
          'tmp/src/main.js'
        ],
        dest: 'dist/main.js'
      }
    },
    jasmine : {
      src : 'dist/main.js',
      options : {
        specs    : 'spec/**/*.js',
        template : 'spec/SpecRunner.html',
        vendor   : [
          'bower_components/jquery/dist/jquery.js'
        ]
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/main.min.js': ['dist/main.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jshint', 'clean', 'babel', 'concat', 'jasmine']);
  grunt.registerTask('dist', ['jshint', 'clean', 'babel', 'concat', 'uglify']);
  grunt.registerTask('default', ['test']);
};
