'use strict';

var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');
var inject = require('gulp-inject');
var Server = require('karma').Server;
var bowerFiles = require('main-bower-files');
var filter = require('gulp-filter');


// Unit test with karma
gulp.task('test', ['karma-bower'], function (done) {
  return new Server({
    configFile: path.join(__dirname, '/../karma.conf.js')
  }, function () {
    done();
  }).start();
});


// bower components for karma runner
gulp.task('karma-bower', function () {
  gulp.src(path.join(conf.paths.root, '/karma.conf.js'))
    .pipe(inject(gulp.src(bowerFiles({filter: '**/*.js', includeDev: true}), {read: false}), {
      starttag: '// bower:js',
      endtag: '// endinject',
      relative: true,
      transform: function (filepath) {
        return '"' + filepath + '",';
      }
    }))
    .pipe(gulp.dest(conf.paths.root));

});