'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var path = require('path');


// copy html templates to app folder
gulp.task('templates', function() {
  return gulp.src(conf.sources.templates)
    .pipe(gulp.dest(path.join(conf.paths.assets, '/templates')));
});