'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var path = require('path');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var cache = require('gulp-cache');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var gulpIf = require('gulp-if');
var colors = require('chalk');

/**
 * Compile the client js files using babel
 */
gulp.task('babel', ['templates'], function () {
	var hasErr;
	return gulp.src(conf.sources.angular)
		.pipe(plumber({
			errorHandler: function (err) {
				gutil.log(colors.red('ERROR DURING JS BUILD'));
				process.stdout.write(err.stack);
				hasErr = err;
				this.emit('end');
			}
		}))
		.pipe(cache(babel({ // Cache output and pipe though Babel
			presets: ['es2015']
		}), {
			key: function (file) {
				return [file.contents.toString('utf8'), file.stat.mtime, file.stat.size].join('');
			},
			success: function (file) {
				gutil.log(gutil.colors.blue('[Babel]'), 'compile', colors.cyan(file.relative));
				return true;
			}
		}))
		.pipe(gulpIf(conf.isDev(), sourcemaps.init()))
		.pipe(concat('app.js'))
		.pipe(replace("\"app\/", "\"\/app\/"))
		.pipe(gulpIf(conf.isDev(), sourcemaps.write()))
		.pipe(gulp.dest(path.join(conf.paths.assets, '/js')))
		.on('end', function () {
			if (!hasErr) {
				gutil.log(colors.blue('Rebuilt frontend scripts'));
			}
		});
});


gulp.task('scripts:clean', function (next) {
	cache.clearAll(next);
});