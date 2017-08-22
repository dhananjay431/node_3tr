var gulp = require('gulp'),
concat = require('gulp-concat'),
gulpCopy = require('gulp-copy'),
livereload = require('gulp-livereload');
gulp.task('vendor', function() {
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js/'));
});
gulp.task('html', function() {
    gulp.src('./html/**/*.html')
    .pipe(gulp.dest('./public/html/'));
});
gulp.task('controller', function() {
  return gulp.src('./html/**/*.controller.js')
    .pipe(concat('controller.js'))
    .pipe(gulp.dest('./public/js/'));
});
gulp.task('service', function() {
  return gulp.src('./html/**/*.service.js')
    .pipe(concat('service.js'))
    .pipe(gulp.dest('./public/js/'));
});
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch([
    './html/**/*.html',
    './html/**/*.controller.js',
    './html/**/*.service.js'], 
    [
    'vendor',
    'controller',
    'service',
    'html'
    ]);

});
gulp.task('default', ['watch']);