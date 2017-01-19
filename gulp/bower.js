'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('gulp-bower');
var colors = require('chalk');

// Install Bower dependencies
gulp.task('bower', function () {
  gutil.log(colors.blue('Installing bower components!'));
  return bower();
});