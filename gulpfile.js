var gulp   = require('gulp');
var gutil  = require('gulp-util');
var clean  = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass   = require('gulp-sass');
var livereload = require('gulp-livereload');

var paths = {
  scripts: ['src/js/**/*.js'],
  styles:  ['src/sass/main.scss'],
  images:  ['src/img/**/*']
};

// clean bower components
gulp.task('clean:components', function(){
  return gulp.src(['dist/lib/'], {read:false})
    .pipe(clean());
});

// clean images
gulp.task('clean:images', function(){
  return gulp.src(['dist/img/'], {read:false})
    .pipe(clean());
});

//
gulp.task('components', ['clean:components'], function(){
  gulp.src([
    './bower_components/**/*'
  ])
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('images', ['clean:images'], function(){
  gulp.src([
    './src/img/**/*'
  ])
    .pipe(gulp.dest('dist/img'));
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  'components',
  'images',
  'scripts',
  'styles',
  'watch'
]);
