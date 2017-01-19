'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

gulp.task('build', function (done) {
  runSequence(
    'sass',
    'inject',
    'clean',
    'useref',
    'copy',
    done
  )
});