'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var annotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');


gulp.task('useref', function () {
  gutil.log('Minifying & asset revisioning - ' + gutil.colors.blue('This may take some time!'));
  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });
  var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

  return gulp.src(path.join(conf.paths.app, '/index.html'))
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(annotate())
    .pipe(uglify({mangle: false}))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cssnano())
    .pipe(cssFilter.restore)
    .pipe(indexHtmlFilter)
    .pipe(rev())
    .pipe(indexHtmlFilter.restore)
    .pipe(revReplace())
    .pipe(gulp.dest(conf.paths.build));
});