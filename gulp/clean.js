'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var del = require('del');

gulp.task('clean', function () {
  return del.sync(conf.paths.build, {force: true});
});