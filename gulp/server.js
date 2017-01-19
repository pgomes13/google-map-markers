var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var util = require('gulp-util');
var browserSync = require('browser-sync').create();


// create a web server for live-reloading
gulp.task('server:dev', function () {
  browserSync.init({
    server: {
      baseDir: conf.paths.app
    }
  })

  gulp.watch(conf.sources.sass, ['sass']);
  gulp.watch(conf.sources.angular, ['babel']);
  gulp.watch(conf.sources.templates, ['templates']);
  gulp.watch(conf.sources.css).on('change', browserSync.reload);
  gulp.watch(conf.sources.js).on('change', browserSync.reload);
  gulp.watch(path.join(conf.paths.assets, '/templates/**/*.html')).on('change', browserSync.reload);
});


// create a web server to serve the prod build
gulp.task('server:prod', function () {
  browserSync.init({
    server: {
      baseDir: conf.paths.build
    }
  })
});