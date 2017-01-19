'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

gulp.task('run:dev', function (done) {
  runSequence(
    'inject',
    'server:dev',
    done
  )
});

gulp.task('run:prod', function (done) {
  runSequence(
    'build',
    'server:prod',
    done
  )
});