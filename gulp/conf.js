'use strict';

var util = require('gulp-util');

/**
 * The main paths of this project.
 * Please handle with care!
 */
exports.paths = {
  root:'./',
  build: './.build',
  app: './app',
  angular: './angular',
  sass: './sass',
  assets: './app/assets'
};

exports.sources = {
  angular: [
    exports.paths.angular + '/app.modules.js',
    exports.paths.angular + '/**/*.js',
    '!' + exports.paths.angular + '/**/specs/*.spec.js'
  ],
  sass: [
    exports.paths.sass + '/*.scss',
    exports.paths.sass + '/**/*.scss'
  ],
  css: [
    exports.paths.assets + '/css/*.css'
  ],
  js: [
    exports.paths.assets + '/js/*.js'
  ],
  templates: [
    exports.paths.angular + '/**/*.html'
  ]
};


exports.isDev = function () {
  return util.env.dev ? true : false;
};