'use strict';

// Get all the dependincies
var gulp = require('gulp'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync'),
  plumber = require('gulp-plumber');

gulp.task('serve', ['sass', 'compress-js'], function () {

  browserSync.init({
    server: './',
    notify: false
  });

  gulp.watch(['./src/sass/**/*.sass'], ['sass']);
  gulp.watch(['./src/js/*.js'], ['compress-js']);

  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('./src/js/*.js').on('change', browserSync.reload);
  gulp.watch('./src/sass/*.sass').on('change', browserSync.reload);

});

// sass task
gulp.task('sass', function () {
  return gulp.src('src/sass/*.sass')
    .pipe(plumber())
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'));
});

// Concat task
// gulp.task('concat', function () {
//   return gulp.src(['app/dev/js/charlie.js', 'app/dev/js/promise.js', 'app/dev/js/fetch.js', 'app/dev/js/pictor.js'])
//     .pipe(concat('compiled.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('app/js'))
// });

// js compress task
gulp.task('compress-js', function () {
  return gulp.src('./src/js/*.js')
  .pipe(plumber())
    // .pipe(uglify())
    // .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/js'));
});


// default task
gulp.task('default', ['serve']);