'use strict';

var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');

gulp.task('inject', ['sass', 'babel', 'bower'], function() {
  return gulp.src(path.join(conf.paths.app, '/index.html'))
    .pipe(inject(gulp.src(bowerFiles(), { read: false }), { name: 'bower', relative: true, addRootSlash: true }))
    .pipe(inject(gulp.src(conf.sources.css.concat(conf.sources.js), { read: false }), { relative: true, addRootSlash: true }))
    .pipe(gulp.dest(conf.paths.app));
});