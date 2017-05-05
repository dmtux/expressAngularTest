var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function () {
  gulp.src(['./app_client/**/*.js', '!./app_client/**/*.test.js', '!./app_client/app.min.js', '!./app_client/lib/*'])
    .pipe(sourcemaps.init())
    .pipe(concat('./app.min.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('public/'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/'));

  gulp.src(['./app_client/**/*.html']).pipe(gulp.dest('public/'));
  gulp.src(['./app_client/lib/**/*.*']).pipe(gulp.dest('public/lib'));
});

gulp.task('watch', function () {
  watch(['./app_client/**/*.js', '!./app_client/**/*.test.js', '!./app_client/app.min.js'], function () {
    gulp.start('scripts');
  });
});

gulp.task('default', ['scripts', 'watch']);
