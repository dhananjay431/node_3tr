var gulp = require('gulp'),
concat = require('gulp-concat'),
gulpCopy = require('gulp-copy'),
livereload = require('gulp-livereload');

gulp.task('html', function() {
    gulp.src('./html/**/*.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('../websrc/html/'));
});

gulp.task('controller', function() {
  return gulp.src('./html/**/*.controller.js')
    .pipe(concat('controller.js'))
    .pipe(gulp.dest('../websrc/js/'));
});

gulp.task('service', function() {
  return gulp.src('./html/**/*.service.js')
    .pipe(concat('service.js'))
    .pipe(gulp.dest('../websrc/js/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch([
    './html/**/*.html',
    './html/**/*.controller.js',
    './html/**/*.service.js'], 
    ['controller',
    'service',
    'html']);
});



gulp.task('default', ['watch']);