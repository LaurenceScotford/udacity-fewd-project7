const {src, dest, watch, series, parallel} = require('gulp');
const connect = require('gulp-connect');
const del = require('del');
const fs = require('fs');

function clean(cb) {
  return del(['dist']);
  cb();
}

function cleanImages(cb) {
  return del(['dist/img']);
  cb();
}

function buildImages() {
  return src('img/*')
    .pipe(dest('dist/img'))
    .pipe(connect.reload());
}

function cleanCss(cb) {
  return del(['dist/css']);
  cb();
}

function buildCss() {
  return src('css/*')
    .pipe(dest('dist/css'))
    .pipe(connect.reload());
}

function cleanJs(cb) {
  return del(['dist/js']);
  cb();
}

function buildJs() {
  return src('js/*')
    .pipe(dest('dist/js'))
    .pipe(connect.reload());
}

function cleanData(cb) {
  return del(['dist/data']);
  cb();
}

function buildData() {
  return src('data/*')
    .pipe(dest('dist/data'))
    .pipe(connect.reload());
}

function cleanHtml(cb) {
  return del(['dist/*.html']);
  cb();
}

function buildHtml() {
  return src('*.html')
    .pipe(dest('dist'))
    .pipe(connect.reload());
}

function serve(cb) {
  connect.server({
    root: 'dist',
    livereload: true
  }, function() {
    this.server.on('close', cb) 
  });
}

function watcher(cb) {
  watch('img/*', series(cleanImages, buildImages));
  watch('css/*', series(cleanCss, buildCss));
  watch('js/*', series(cleanJs, buildJs));
  watch('data/*', series(cleanData, buildData));
  watch('*.html', series(cleanHtml, buildHtml));
  cb();
}

exports.clean = series(clean);
exports.serve = series(serve);
exports.build = series(clean, buildImages, buildCss, buildJs, buildData, buildHtml);
exports.default = parallel(serve, series(clean, buildImages, buildCss, buildJs, buildData, buildHtml, watcher));
